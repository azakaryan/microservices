import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const signin = (id: string = Types.ObjectId().toHexString()): string[] => {
    // Build a JWT payload { id, email }.
    const payload = {
        id,
        email: 'test@test.com',
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object.
    const session = { jwt: token };

    // Turn the session into JSON.
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it into base64.
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return a string similar to cookie format.
    return [`express:sess=${base64}`]; 
}

export { signin }