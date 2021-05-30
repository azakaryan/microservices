import express, { Request, Response }  from 'express';
import { validateRequest } from '../middlewares/validate-request';
const router = express.Router();
import { body } from 'express-validator';
import { UsersService } from '../services/user-service';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await UsersService.getUserByEmail(email);

    if (!existingUser) throw new BadRequestError('Invalid credentials');

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) throw new BadRequestError('Invalid credentials');

    // Generate JWT
    const userJwt = jwt.sign(
        {
            id: existingUser.id,
            email: existingUser.email,
        },
        process.env.JWT_KEY!,
    );

    // Store in Session object
    req.session = {
        jwt: userJwt,
    }

    res.send(existingUser);
});

export { router as signinRouter };