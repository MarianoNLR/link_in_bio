import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLinkDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsUUID()
  platformId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}