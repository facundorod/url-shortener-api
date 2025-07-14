import { HttpException } from '@nestjs/common';

export class UnauthorizedUser extends HttpException {
  constructor() {
    super({ message: 'Unauthorized user' }, 401);
  }
}
