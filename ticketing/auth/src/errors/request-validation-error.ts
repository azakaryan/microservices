import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(private errors: ValidationError[]) {
        super('something went wrong with validation');

        // Only bacause we are extending a build in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors(): { message: string, field: string }[] {
        return this.errors
            .map(({ param, msg }: ValidationError) => ({ message: msg, field: param }));
    }
}