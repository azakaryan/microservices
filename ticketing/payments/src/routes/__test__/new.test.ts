import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../../app';
import { signin } from '../../test/auth-helper'
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';
import { Order, OrderStatus } from '../../models/order';

it ('has a route handler listening /api/payments for post requests', async () => {
  const response = await request(app)
      .post('/api/payments')
      .send({});
  
  expect(response.status).not.toEqual(404);
});

it ('can only be accessed if user is signed in', async () => {
  await request(app)
      .post('/api/payments')
      .send({})
      .expect(401);
});

it ('returns status other then 401 if user is not signed in', async () => {
  const response = await request(app)
      .post('/api/payments')
      .set('Cookie', signin())
      .send({});

  expect(response.status).not.toEqual(401);    
});

it ('returns 404 if order is not found', async () => {
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    version: 0,
    userId: Types.ObjectId().toHexString(),
    price: 90,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
      .post('/api/payments')
      .set('Cookie', signin())
      .send({
          token: 'token',
          orderId: Types.ObjectId().toHexString(),
      })
      .expect(404);
});

it ('returns 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    version: 0,
    userId: Types.ObjectId().toHexString(),
    price: 90,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
      .post('/api/payments')
      .set('Cookie', signin())
      .send({
          token: 'token',
          orderId: order.id,
      })
      .expect(401);       
});

it ('returns 400 when purchasing cancelled order', async () => {
  const userId = Types.ObjectId().toHexString();

  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 90,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
      .post('/api/payments')
      .set('Cookie', signin(userId))
      .send({
          token: 'token',
          orderId: order.id,
      })
      .expect(400);   
});

it ('returns a 201 with valid records', async () => {
  const userId = Types.ObjectId().toHexString();

  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 90,
    status: OrderStatus.Created,
  });
  await order.save();

  const paymentResponse = await request(app)
      .post('/api/payments')
      .set('Cookie', signin(userId))
      .send({
          token: 'tok_mastercard',
          orderId: order.id,
      })
      .expect(201);

  expect(stripe.charges.create).toHaveBeenCalled();
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('usd');
  expect(chargeOptions.source).toEqual('tok_mastercard');

  const payment = await Payment.findById(paymentResponse.body.id);
  expect(payment).not.toBeNull();
  expect(payment!.stripeId).toEqual(paymentResponse.body.stripeId);
});