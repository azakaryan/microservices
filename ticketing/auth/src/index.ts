
import { json } from 'body-parser';
import express from 'express';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';

const app = express();
app.use(json());

app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(currentUserRouter);

app.listen(3000, () => {
    console.log('v333')
    console.log('AUTH: Listening on 3000');
});