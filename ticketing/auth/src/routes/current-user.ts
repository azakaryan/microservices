import express from 'express';
const router = express.Router();
import { UsersService } from '../services/user-service';

router.get('/api/users/currentuser', async (req, res) => {
    try {
        const users = await UsersService.getUsers();
        res.status(200).json( users );
    } catch (error) {
        throw error;
    }
});

export { router as currentUserRouter };