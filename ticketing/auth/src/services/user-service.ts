import { User, UserAttrs, UserDoc } from '../models/user'
import { ResourseConflictError } from '../errors/resourse-conflict-error';

export class UsersService {
    static async createUser({ email, password }: UserAttrs): Promise<UserDoc> {
        const findModel: UserDoc | null = await User.findOne({ email });
        if (findModel) throw new ResourseConflictError(`resourse with email: ${email} is already exists`);
    
        const user: UserDoc = await User.build({ email, password });
        await user.save();

        return user; 
    }
}