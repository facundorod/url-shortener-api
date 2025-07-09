import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isURL } from 'class-validator';
@Injectable()
export class IsValidUrl implements PipeTransform {
  transform(value: string) {
    if (!value) {
      throw new BadRequestException('URL is required');
    }
    if (!isURL(value, { protocols: ['http', 'https'] })) {
      throw new BadRequestException('URL is not valid');
    }
    return value;
  }
}
