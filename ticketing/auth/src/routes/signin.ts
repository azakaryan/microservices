import express from 'express';
const router = express.Router();

router.post('/api/users/signin', (req, res) => {
    console.log('post sign in');
    res.send('post sign in!');
});

export { router as signinRouter };