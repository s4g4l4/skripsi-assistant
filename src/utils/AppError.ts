export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: any;

  constructor(message: string, statusCode = 500, isOperational = true, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: any) {
    return new AppError(message, 400, true, details);
  }

  static unauthorized(message = 'Akses tidak diizinkan. Silakan login terlebih dahulu.') {
    return new AppError(message, 401, true);
  }

  static forbidden(message = 'Anda tidak memiliki hak akses untuk tindakan ini.') {
    return new AppError(message, 403, true);
  }

  static notFound(message = 'Resource yang diminta tidak ditemukan.') {
    return new AppError(message, 404, true);
  }

  static tooManyRequests(message = 'Terlalu banyak permintaan. Silakan coba lagi nanti.') {
    return new AppError(message, 429, true);
  }

  static internal(message = 'Terjadi kesalahan internal pada server.', details?: any) {
    return new AppError(message, 500, false, details);
  }
}
