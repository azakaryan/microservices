import express from 'express';
const router = express.Router();

router.post('/api/users/signup', (req, res) => {
    const { email, password } = req.body;

    console.log('post sign up');
    res.send('post sign up!');
});

export { router as signupRouter };