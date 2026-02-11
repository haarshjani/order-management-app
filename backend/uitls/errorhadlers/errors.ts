import { AppError } from './central_error';

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request',data?:any) {
    super(message, 400, data);
  }
}
export class IllegalArgumentError extends AppError {
  constructor(message = 'Illegal argument') {
    super(message, 400);
  }
}
export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Bad Request',data?:any) {
    super(message, 403, data);
  }
}
