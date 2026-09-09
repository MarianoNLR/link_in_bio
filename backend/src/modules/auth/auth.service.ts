import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const existingEmail = await this.usersService.findByEmail(dto.email);

    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    const existingUsername = await this.usersService.findByUsername(
      dto.username,
    );

    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }

    const passwordHash: string = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      displayName: dto.displayName,
      passwordHash,
    });

    const tokens = await this.createSession(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.createSession(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
    };
  }

  async logout(refreshToken?: string) {
    if (
      !refreshToken ||
      !/^[0-9a-f-]{36}\.[A-Za-z0-9_-]{43}$/.test(refreshToken)
    )
      return;
    await this.prisma.session.deleteMany({
      where: {
        id: refreshToken.split('.')[0],
        refreshTokenHash: this.hashToken(refreshToken),
      },
    });
  }

  async refresh(refreshToken: string) {
    const sessionId = refreshToken.split('.')[0];
    const refreshTokenHash = this.hashToken(refreshToken);
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (
      !session ||
      session.expiresAt <= new Date() ||
      session.refreshTokenHash !== refreshTokenHash
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const nextRefreshToken = this.generateRefreshToken(session.id);

    // Compare and swap prevents concurrent requests from reusing a token.
    const result = await this.prisma.session.updateMany({
      where: {
        id: session.id,
        refreshTokenHash,
        expiresAt: { gt: new Date() },
      },
      data: { refreshTokenHash: this.hashToken(nextRefreshToken) },
    });

    if (result.count !== 1) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const accessToken = await this.generateAccessToken(session.userId);

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      refreshTokenExpiresAt: session.expiresAt,
    };
  }

  private async createSession(userId: string) {
    const id = randomUUID();
    const refreshToken = this.generateRefreshToken(id);
    const accessToken = await this.generateAccessToken(userId);
    const refreshTokenExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );
    await this.prisma.session.create({
      data: {
        id,
        userId,
        refreshTokenHash: this.hashToken(refreshToken),
        expiresAt: refreshTokenExpiresAt,
      },
    });
    return { accessToken, refreshToken, refreshTokenExpiresAt };
  }

  private generateRefreshToken(sessionId: string) {
    return `${sessionId}.${randomBytes(32).toString('base64url')}`;
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({
      sub: userId,
    });
  }
}
