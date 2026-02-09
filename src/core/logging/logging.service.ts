import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger {
  customLog(message: string) {
    // Customize your log message here
    this.log(message);
  }
}
