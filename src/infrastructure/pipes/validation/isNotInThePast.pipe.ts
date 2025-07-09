import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUrlDto } from '@/domain/dtos/createUrl.dto';

@Injectable()
export class CreateUrlExpirationIsNotInThePast implements PipeTransform {
  transform(value: CreateUrlDto) {
    if (value && value.expiresAt && new Date(value.expiresAt) < new Date()) {
      throw new BadRequestException('Expiration date must be in the future');
    } else {
      return value;
    }
  }
}
