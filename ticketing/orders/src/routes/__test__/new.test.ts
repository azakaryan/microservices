import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-helper'
import { Types } from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it ('has a route handler listening /api/orders for post requests', async () => {
    const response = await request(app)
        .post('/api/orders')
        .send({});
    
    expect(response.status).not.toEqual(404);
});

it ('can only be accessed if user is signed in', async () => {
    await request(app)
        .post('/api/orders')
        .send({})
        .expect(401);
});

it ('returns status other then 401 if user is signed in', async () => {
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', signin())
        .send({});

    expect(response.status).not.toEqual(401);    
});

it ('returns an error if invalid ticketId is provided', async () => {
    await request(app)
        .post('/api/orders')
        .set('Cookie', signin())
        .send({})
        .expect(400);

    await request(app)
        .post('/api/orders')
        .set('Cookie', signin())
        .send({
          ticketId: '11234',
        })
        .expect(400);
});

it ('returns 404 if ticket does not found', async () => {
  await request(app)
      .post('/api/orders')
      .set('Cookie', signin())
      .send({ 
        ticketId: Types.ObjectId()
      })
      .expect(404);
});

it ('returns 400 if ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'Title',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'test-id',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save();

  await request(app)
      .post('/api/orders')
      .set('Cookie', signin())
      .send({ 
        ticketId: ticket.id
      })
      .expect(400);
});

it ('reserves a ticket', async () => {      
  const ticket = Ticket.build({
    title: 'Title',
    price: 20,
  });
  await ticket.save();

  await request(app)
      .post('/api/orders')
      .set('Cookie', signin())
      .send({ 
        ticketId: ticket.id
      })
      .expect(201);
});

it ('returns created order when reserves a ticket', async () => {      
  const ticket = Ticket.build({
    title: 'Title',
    price: 20,
  });
  await ticket.save();

  const order = await request(app)
      .post('/api/orders')
      .set('Cookie', signin())
      .send({ 
        ticketId: ticket.id
      })
      .expect(201);

   expect(order.body.status).toEqual(OrderStatus.Created);   
});

it.todo('emits an order created event');