import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@az-tickets/common';
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order';

const setup = async() => {
  // create an isntance of listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create an order
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  // create a fake data of event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
        id: Types.ObjectId().toHexString(),
    }
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
}

it ('cancels the order', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify orderId to be defined in a ticket 
  const order = await Order.findById(data.id);

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it ('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify ack function is called
  expect(msg.ack).toBeCalledTimes(1);
});