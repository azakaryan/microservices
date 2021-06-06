import { TicketUpdatedLstener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { TicketUpdatedEvent } from '@az-tickets/common';
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket';


const setup = async() => {
  // create an isntance of listener
  const listener = new TicketUpdatedLstener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: 'concert',
    price: 12
  });
  await ticket.save();

  // create a fake data of event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'concert new',
    price: 20,
    userId: Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
}

it ('finds, saves and updates the ticket', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // veryfy ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
});

it ('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify ack function is called
  expect(msg.ack).toBeCalledTimes(1);
});

it ('does not call acks if the event has skipped version number', async () => {
  const { listener, data, msg } = await setup();

  data.version = 2;
  // call onMessage function with data object + message object
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  // verify ack function has not been called
  expect(msg.ack).not.toBeCalled();
});

