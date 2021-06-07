import { Types } from 'mongoose';
import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@az-tickets/common';
import { body } from 'express-validator'
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

const router = express.Router();

router.post(
    '/api/orders',
    requireAuth, [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => Types.ObjectId.isValid(input))
            .withMessage('TicketId is required'),
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        
        // Find the ticket the user is trying to order in the database.
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) throw new NotFoundError();

        // Make sure that this ticket is not already reserved.
        const isReserved = await ticket.isReserved()
        if (isReserved) throw new BadRequestError('Ticket is already reserved');

        // Calculate expiration date for order.
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and save
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        await order.save();
        
        // Publish event order is created.
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            userId: order.userId,
            status: order.status,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            ticket: {
                id: ticket.id,
                price: ticket.price,
            }
        });

        res.status(201).send(order);
    }
);

export { router as createOrderRouter };