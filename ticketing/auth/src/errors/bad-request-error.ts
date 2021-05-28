import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(message: string) {
        super(message);

        // Only bacause we are extending a build in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors(): { message: string }[] {
        return [{ message: this.message}];
    }
}