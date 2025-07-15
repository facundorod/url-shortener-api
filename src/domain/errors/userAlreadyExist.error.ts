import { HttpException } from '@nestjs/common';

export class EmailAlreadyExist extends HttpException {
  constructor() {
    super({ message: 'The email is already in use' }, 422);
  }
}
