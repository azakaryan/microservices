import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../../app';
import { signin } from '../../test/auth-helper'; 

it ('return 404 if provided id does not exist', async () => {
    const id = Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signin())
        .send({
            title: 'newTitle',
            price: 100,
        })
        .expect(404);
});

it ('return 401 if user is not authenticated', async () => {
    const id = Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'newTitle',
            price: 100,
        })
        .expect(401);
});

it ('return 401 if user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({ title: 'Title 1', price: 10 });;

    const notUpdatedResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin())
        .send({
            title: 'newTitle',
            price: 100,
        })
        .expect(401);
    
    expect(notUpdatedResponse.body.errors[0].message).toEqual('Not authorized');
});

it ('return 400 if user provides an invalid title', async () => {
    const cookie = signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'Title 1', price: 10 });;

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 100,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            price: 100,
        })
        .expect(400);    
});

it ('return 400 if user provides an invalid price', async () => {
    const cookie = signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'Title 1', price: 10 });;

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'newTitle',
            price: -10,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'newTitle',
        })
        .expect(400);    
});

it ('return 200 when valid input is provided', async () => {
    const cookie = signin();
    const initialProps = { title: 'Title', price: 10 };
    const newProps = { title: 'newTitle', price: 100 };
     
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send(initialProps);

    const updatedResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send(newProps)
        .expect(200);
    
    expect(updatedResponse.body.title).toEqual(newProps.title);
    expect(updatedResponse.body.price).toEqual(newProps.price);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(newProps.title);
    expect(ticketResponse.body.price).toEqual(newProps.price); 
});