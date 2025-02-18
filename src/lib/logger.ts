import { toast } from 'sonner';

type LogLevel = 'info' | 'warn' | 'error';

interface LogOptions {
  showToast?: boolean;
  context?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  
  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(level: LogLevel, message: string, options: LogOptions = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      environment: process.env.NODE_ENV,
      ...options.context
    };

    // Console logging in development only
    if (process.env.NODE_ENV === 'development') {
      console[level](JSON.stringify(logEntry, null, 2));
    }

    // Toast notifications for UI
    if (options.showToast) {
      switch (level) {
        case 'error':
          toast.error(message);
          break;
        case 'warn':
          toast.warning(message);
          break;
        case 'info':
          toast.info(message);
          break;
      }
    }

    // In production, you would send logs to a logging service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to logging service
      // await logService.send(logEntry);
    }
  }

  info(message: string, options?: LogOptions) {
    this.log('info', message, options);
  }

  warn(message: string, options?: LogOptions) {
    this.log('warn', message, options);
  }

  error(message: string, options?: LogOptions) {
    this.log('error', message, options);
  }
}

export const logger = Logger.getInstance();