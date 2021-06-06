import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-helper';
import { Ticket } from '../../models/ticket';
import { Types } from 'mongoose';

const createOrder = async (cookie: string[], ticketId: string) => {
  return request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({ 
        ticketId
      });
}

const createTicket = async () => {
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: 'Title',
    price: 20,
  });
  
  await ticket.save();

  return ticket;
}

it ('fetches specific order for a particular user', async () => {
  const cookie = signin();
  
  // Create a tickets
  const ticket = await createTicket();

  // Create an order.
  const { body: userOrder } = await createOrder(cookie, ticket.id);

  // Fetch orders for user #1
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${userOrder.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(userOrder.id).toEqual(fetchedOrder.id);
});

it ('returns 401 if not authorised', async () => {
  const cookie = signin();
  
  // Create a tickets
  const ticket = await createTicket();

  // Create an order.
  const { body: userOrder } = await createOrder(cookie, ticket.id);

  // Fetch orders for user #1
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${userOrder.id}`)
    .send({})
    .expect(401);
});

it ('returns 401 when one user tries to fetch order of another user', async () => {
  const cookie = signin();
  
  // Create a tickets
  const ticket = await createTicket();

  // Create an order.
  const { body: userOrder } = await createOrder(cookie, ticket.id);

  // Fetch orders for user #1
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${userOrder.id}`)
    .set('Cookie', signin())
    .send({})
    .expect(401);
});