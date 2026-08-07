import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import { alertSystem } from '../utils/alertSystem.js';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan internal pada server.';
  let details = err.details || null;

  // Handle SyntaxError or Body Parser Error
  if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Format Request Body (JSON) tidak valid.';
  }

  // Handle AppError
  const isOperational = err instanceof AppError ? err.isOperational : false;

  // Log error
  logger.error(message, {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    isOperational,
    stack: err.stack,
    details,
  });

  // If critical 500 error and non-operational (unexpected crash), trigger alert
  if (statusCode >= 500 && !isOperational) {
    alertSystem.sendCriticalAlert(`Unhandled Server Error: ${req.method} ${req.originalUrl}`, {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      body: req.body,
    });
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
