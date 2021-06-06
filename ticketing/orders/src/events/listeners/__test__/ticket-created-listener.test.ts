import { TicketCreatedLstener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { TicketCreatedEvent } from '@az-tickets/common';
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket';


const setup = async() => {
  // create an isntance of listener
  const listener = new TicketCreatedLstener(natsWrapper.client);

  // create a fake data of event
  const data: TicketCreatedEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    userId: Types.ObjectId().toHexString(),
    version: 0
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
}

it ('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // veryfy ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it ('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify ack function is called
  expect(msg.ack).toBeCalledTimes(1);
});