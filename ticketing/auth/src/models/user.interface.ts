import { Model, Document } from 'mongoose';

// An interface that describes user creation.
export interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties that User model has.
export interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that User document has.
export interface UserDoc extends Document, UserAttrs {}