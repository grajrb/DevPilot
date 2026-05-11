import { Injectable, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  private context: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, ...args: any[]) {
    console.log(`[${new Date().toISOString()}] [${this.context || 'LOG'}]`, message, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(`[${new Date().toISOString()}] [${this.context || 'ERROR'}]`, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(`[${new Date().toISOString()}] [${this.context || 'WARN'}]`, message, ...args);
  }

  debug(message: string, ...args: any[]) {
    if (process.env['NODE_ENV'] === 'development') {
      console.debug(`[${new Date().toISOString()}] [${this.context || 'DEBUG'}]`, message, ...args);
    }
  }

  verbose(message: string, ...args: any[]) {
    console.log(`[${new Date().toISOString()}] [${this.context || 'VERBOSE'}]`, message, ...args);
  }
}
