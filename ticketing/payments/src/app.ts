import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';
import { createChargeRouter } from './routes/new';
import { currentUser, errorHandler, NotFoundError } from '@az-tickets/common';
import cookieSession from 'cookie-session';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
);
app.use(currentUser);

app.use(createChargeRouter);

app.get('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }