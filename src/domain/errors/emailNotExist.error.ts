import { HttpException } from '@nestjs/common';

export class EmailNotExist extends HttpException {
  constructor() {
    super({ message: 'The email does not exist' }, 422);
  }
}
