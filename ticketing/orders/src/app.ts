import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';
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

app.use(indexOrderRouter)
app.use(showOrderRouter);
app.use(createOrderRouter);
app.use(deleteOrderRouter);

app.get('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }