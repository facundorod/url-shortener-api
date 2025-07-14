import { HttpException } from '@nestjs/common';

export class UrlNotFound extends HttpException {
  constructor() {
    super({ message: 'URL not found' }, 404);
  }
}
