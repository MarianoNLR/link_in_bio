import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  uploadImage(file: Express.Multer.File): Promise<{ secureUrl: string, publicId: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'avatars' },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(new BadGatewayException('Image upload failed'));
            return;
          }

          resolve({ secureUrl: result.secure_url, publicId: result.public_id });
        },
      );

      stream.on('error', () => {
        reject(new BadGatewayException('Image upload failed'));
      });
      stream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  }
}
