import { CustomError } from './custom-error';

export class ResourseConflictError extends CustomError {
  statusCode = 409;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ResourseConflictError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
