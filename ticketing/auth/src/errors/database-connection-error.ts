import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
    reason = 'error connecting to database';
    statusCode = 500;

    constructor() {
        super('error connecting to database');

        // Only bacause we are extending a build in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors(): { message: string }[] {
        return [{
            message: this.reason,
        }];
    }
}