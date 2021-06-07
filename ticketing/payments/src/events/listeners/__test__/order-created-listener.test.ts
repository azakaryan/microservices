import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { OrderCreatedEvent, OrderStatus, Subjects, TicketUpdatedEvent } from '@az-tickets/common';
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order';


const setup = async() => {
  // create an isntance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a fake data of event
  const data: OrderCreatedEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    userId: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
        id: Types.ObjectId().toHexString(),
        price: 20,
    }
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
}

it ('create, saves order', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify orderId to be defined in a ticket 
  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order!.price).toEqual(data.ticket.price);
});

it ('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify ack function is called
  expect(msg.ack).toBeCalledTimes(1);
});