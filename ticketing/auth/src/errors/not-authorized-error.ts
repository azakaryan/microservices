import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not authorized');

        // Only bacause we are extending a build in class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors(): { message: string }[] {
        return [{ message: 'Not authorized'}];
    }
}