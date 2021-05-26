import express from 'express';
const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    console.log('post sign out');
    res.send('post sign out!');
});

export { router as signoutRouter };