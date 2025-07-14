import { LoggerService } from '@nestjs/common';

export interface Logger extends LoggerService {
  log(message: string, ...optionalParams: unknown[]): void;
  error(message: string, ...optionalParams: unknown[]): void;
  warn(message: string, ...optionalParams: unknown[]): void;
  debug?(message: string, ...optionalParams: unknown[]): void;
  verbose?(message: string, ...optionalParams: unknown[]): void;
  fatal?(message: string, ...optionalParams: unknown[]): void;
  setLogLevels?(levels: LogLevel[]): void;
}

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
