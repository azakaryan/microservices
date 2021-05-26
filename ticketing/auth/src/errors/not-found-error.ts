import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super('route not found');

        // Only bacause we are extending a build in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): { message: string }[] {
        return [{ message: 'Not found'}];
    }
}