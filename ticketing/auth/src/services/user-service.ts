import { User } from '../models/user'
import { UserAttrs, UserDoc } from '../models/user.interface';
import { ResourseConflictError } from '../errors/resourse-conflict-error';

export class UsersService {
    static async createUser({ email, password }: UserAttrs): Promise<UserDoc> {
        const findUser: UserDoc | null = await User.findOne({ email });
        if (findUser) throw new ResourseConflictError(`resourse with email: ${email} is already exists`);
    
        const user: UserDoc = await User.build({ email, password });
        await user.save();

        return user; 
    }

    static async getUserByEmail(email: string): Promise<UserDoc | null> {
        return User.findOne({ email });
    }

    // Only for test porpuse.
    static async getUsers(): Promise<UserDoc[]> {
        const users: UserDoc[] | null = await User.find();
        return users; 
    }
}