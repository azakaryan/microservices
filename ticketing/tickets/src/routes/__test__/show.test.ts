import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../../app';
import { signin } from '../../test/auth-helper';

it ('return 404 if no ticket found', async () => {
    const id = Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);    
});

it ('return the ticket if found', async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({ title, price })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price); 
});