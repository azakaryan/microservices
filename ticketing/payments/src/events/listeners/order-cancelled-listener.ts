import { Listener, NotFoundError, Subjects, OrderCancelledEvent, OrderStatus } from '@az-tickets/common'
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the Order
    const order = await Order.findByEvent({ id: data.id, version: data.version });

    // If no, throw error
    if (!order) throw new NotFoundError();

    // Mark the order as being cancelled
    order.set({ status: OrderStatus.Cancelled });

    // Save the order
    await order.save();

    // ack the message
    msg.ack();
  }
}