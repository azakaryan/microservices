import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-helper'
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it ('has a route handler listening /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    
    expect(response.status).not.toEqual(404);
});

it ('can only be accessed if user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);
});

it ('returns status other then 401 if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({});

    expect(response.status).not.toEqual(401);    
});

it ('returns an error if invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: '',
            price: 10,
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            price: 10,
        })
        .expect(400);
});

it ('returns an error if invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'Title',
            price: -1,
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'Title',
        })
        .expect(400);
});

it ('creates a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'Title',
            price: 20,
        })
        .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual('Title');
    expect(tickets[0].price).toEqual(20);        
});

it ('publishes an event', async () => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'Title',
            price: 20,
        })
        .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});