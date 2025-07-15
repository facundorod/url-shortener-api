import { Module } from '@nestjs/common';
import { WinstonLogger } from './winston.adapter';

@Module({
  providers: [WinstonLogger],
  exports: [WinstonLogger],
})
export class WinstonModule {}
