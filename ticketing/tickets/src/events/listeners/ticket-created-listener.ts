import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@az-tickets/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = '???';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log(data.id);
        console.log(data.title);
        console.log(data.price);
        console.log(data.userId);

        msg.ack();
    }
}