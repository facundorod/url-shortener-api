import { HttpException } from '@nestjs/common';

export class UserNotExist extends HttpException {
  constructor() {
    super({ message: 'The user does not exist' }, 404);
  }
}
