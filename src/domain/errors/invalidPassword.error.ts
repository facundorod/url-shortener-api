import { HttpException } from '@nestjs/common';

export class InvalidPassword extends HttpException {
  constructor() {
    super({ message: 'The password is incorrect' }, 412);
  }
}
