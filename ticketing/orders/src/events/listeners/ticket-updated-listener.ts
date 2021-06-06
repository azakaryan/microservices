import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from '@az-tickets/common'
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';

export class TicketUpdatedLstener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, version, title, price } = data;

    const ticket = await Ticket.findByEvent({ id, version})

    if (!ticket) throw new NotFoundError();

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}