export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: string;
   public readonly data: any;


  constructor(message: string, statusCode: number, data :any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.data = data;
    this.timestamp = new Date().toISOString();

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
      ...this.data,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }
}
