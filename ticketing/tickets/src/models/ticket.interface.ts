import { Model, Document } from 'mongoose';

// An interface that describes ticket creation.
export interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// An interface that describes the properties that Ticket model has.
export interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties that Ticket document has.
export interface TicketDoc extends Document, TicketAttrs {
    version: number;
}