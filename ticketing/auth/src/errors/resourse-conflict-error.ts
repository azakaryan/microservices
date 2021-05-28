import { CustomError } from './custom-error';

export class ResourseConflictError extends CustomError {
    statusCode = 409;

    constructor(message: string) {
        super(message);

        // Only bacause we are extending a build in class
        Object.setPrototypeOf(this, ResourseConflictError.prototype);
    }

    serializeErrors(): { message: string }[] {
        return [{ message: this.message}];
    }
}