import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { OrderCancelledEvent, Subjects, TicketUpdatedEvent } from '@az-tickets/common';
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket';


const setup = async() => {
  // create an isntance of listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create and save a ticket
  const orderId = Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 12,
    userId: Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId });
  await ticket.save();

  // create a fake data of event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
        id: ticket.id,
    }
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
}

it ('sets the orderId of the ticket to "undefined"', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify orderId to be defined in a ticket 
  const ticket = await Ticket.findById(data.ticket.id);

  expect(ticket).toBeDefined();
  expect(ticket!.orderId).toEqual(undefined);
});

it ('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify ack function is called
  expect(msg.ack).toBeCalledTimes(1);
});

it ('publishes ticket updated event', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // verify publish is called
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const [ subject, event ] = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
  expect(subject).toEqual(Subjects.TicketUpdated);
  const ticketUpdatedEventData: TicketUpdatedEvent['data'] = JSON.parse(event);
  expect(ticketUpdatedEventData.id).toEqual(data.ticket.id);
  expect(ticketUpdatedEventData.orderId).toEqual(undefined);
});