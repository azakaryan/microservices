import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { UsersService } from '../services/user-service';
import { validateRequest } from '../middlewares/validate-request';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Must be valid email.'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters.')
], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    try {
        const user = await UsersService.createUser({ email, password });

        // Generate JWT
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_KEY!,
        );

        // Store in Session object
        req.session = {
            jwt: userJwt,
        }

        res.status(201).json( user );
    } catch (error) {
        throw error;
    }
});

export { router as signupRouter };