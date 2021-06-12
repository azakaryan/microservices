import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { ExpirationCompleteEvent, OrderStatus, Subjects } from '@az-tickets/common';
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';


const setup = async() => {
  // create an isntance of listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: 'concert',
    price: 12
  });
  await ticket.save();

  // create and save order
  const order = Order.build({
    userId: 'asasa',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // create a fake data of event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, order };
}

it ('finds, saves and updates the order', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // veryfy ticket was created
  const order = await Order.findById(data.orderId);

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it ('emit an OrderCancelled event with proper arguments', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  const [ subject, event ] = (natsWrapper.client.publish as jest.Mock).mock.calls[0];  
  const orderId = JSON.parse(event).id;

  expect(orderId).toEqual(data.orderId);
  expect(subject).toEqual(Subjects.OrderCancelled);
});

it ('do not emit an OrderCancelled event if order is already complete', async () => {
  const { listener, data, msg, order } = await setup();

  // set order status to be complete
  order.set({
    status: OrderStatus.Complete
  })
  await order.save();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify publish is not called
  expect(natsWrapper.client.publish).not.toHaveBeenCalled();
});

it ('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify ack function is called
  expect(msg.ack).toBeCalledTimes(1);
});