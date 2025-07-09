import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @IsDate({ message: 'expiresAt must be a valid date' })
  @Type(() => Date)
  expiresAt?: Date;
}
