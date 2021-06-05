import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@az-tickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');
    
    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish event order is canceled
    // new TicketCreatedPublisher(natsWrapper.client).publish({
    //     id: ticket.id,
    //     title: ticket.title,
    //     price: ticket.price,
    //     userId: ticket.userId,
    // });

    res.status(200).send(order);
});

export { router as deleteOrderRouter };