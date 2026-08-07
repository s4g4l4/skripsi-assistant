import fs from 'fs';
import path from 'path';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogPayload {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  meta?: Record<string, any>;
  stack?: string;
}

const LOG_DIR = path.join(process.cwd(), 'logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch {
    // Fallback if filesystem write is restricted
  }
}

class Logger {
  private isProd = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, meta?: Record<string, any>, context?: string): LogPayload {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context || 'Application',
      meta,
      ...(meta?.error instanceof Error && { stack: meta.error.stack }),
    };
  }

  private writeToFile(payload: LogPayload) {
    try {
      const logFile = path.join(LOG_DIR, `${payload.level}.log`);
      const line = JSON.stringify(payload) + '\n';
      fs.appendFileSync(logFile, line, 'utf-8');
    } catch {
      // Ignore file writing errors in restricted envs
    }
  }

  public info(message: string, meta?: Record<string, any>, context?: string) {
    const payload = this.formatMessage('info', message, meta, context);
    console.log(JSON.stringify(payload));
    this.writeToFile(payload);
  }

  public warn(message: string, meta?: Record<string, any>, context?: string) {
    const payload = this.formatMessage('warn', message, meta, context);
    console.warn(JSON.stringify(payload));
    this.writeToFile(payload);
  }

  public error(message: string, meta?: Record<string, any>, context?: string) {
    const payload = this.formatMessage('error', message, meta, context);
    console.error(JSON.stringify(payload));
    this.writeToFile(payload);
  }

  public debug(message: string, meta?: Record<string, any>, context?: string) {
    if (!this.isProd) {
      const payload = this.formatMessage('debug', message, meta, context);
      console.debug(JSON.stringify(payload));
      this.writeToFile(payload);
    }
  }
}

export const logger = new Logger();
