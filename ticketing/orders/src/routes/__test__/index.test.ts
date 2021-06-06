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

const getUserOrders = (cookie: string[]) => {
  return request(app)
    .get('/api/orders')
    .set('Cookie', cookie)
    .send();
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

it ('return 401 if not authorised', async () => {
  const ticket = await createTicket();
  await createOrder(signin(), ticket.id);

  return request(app)
    .get('/api/orders')
    .send()
    .expect(401);
});

it ('fetches orders for a particular user', async () => {
  const cookieUser1 = signin();
  const cookieUser2 = signin();
  
  // Create 3 tickets
  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();

  // Create 1 order as User #1
  const order1 = await createOrder(cookieUser1, ticket1.id);

  // Create 2 orders as User #2
  const order2 = await createOrder(cookieUser2, ticket2.id);
  const order3 = await createOrder(cookieUser2, ticket3.id)

  // Fetch orders for user #1
  const userOneOrders = await getUserOrders(cookieUser1).expect(200);

  // Fetch orders for user #2
  const userTwoOrders = await getUserOrders(cookieUser2).expect(200);

  expect(userOneOrders.body.length).toEqual(1);
  expect(userOneOrders.body[0].id).toEqual(order1.body.id);

  expect(userTwoOrders.body.length).toEqual(2);
});