import { Logger } from '@/domain/ports/logger.port';
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLogger implements Logger {
  private winstonLogger: winston.Logger;

  constructor() {
    this.winstonLogger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.colorize({ all: true }),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  verbose(message: string, ...optionalParameters: unknown[]): void {
    this.winstonLogger.verbose(message, optionalParameters);
  }

  debug(message: string, ...optionalParameters: unknown[]): void {
    this.winstonLogger.debug(message, optionalParameters);
  }
  log(message: string, ...optionalParameters: unknown[]): void {
    this.winstonLogger.info(message, optionalParameters);
  }
  warn(message: string, ...optionalParameters: unknown[]): void {
    this.winstonLogger.warn(message, optionalParameters);
  }
  error(message: string, ...optionalParameters: unknown[]): void {
    this.winstonLogger.error(message, optionalParameters);
  }
}
