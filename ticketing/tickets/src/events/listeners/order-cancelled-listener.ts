import { Listener, NotFoundError, Subjects, OrderCancelledEvent } from '@az-tickets/common'
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';0

export class OrderCancelledLstener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserved
    const ticket = await Ticket.findById(data.ticket.id);

    // If no, throw error
    if (!ticket) throw new NotFoundError();

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: undefined });

    // Save the ticket
    await ticket.save();

    // Publish updates
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId
    });

    // ack the message
    msg.ack();
  }
}