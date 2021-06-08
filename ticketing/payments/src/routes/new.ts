import express, { Request, Response } from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@az-tickets/common';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { Order, OrderStatus } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'

const router = express.Router();

router.post(
    '/api/payments',
    requireAuth,
    [
        body('orderId').not().isEmpty(),
        body('token').not().isEmpty(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) throw new NotFoundError();

        if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

        if (order.status === OrderStatus.Cancelled) throw new BadRequestError('Cannot pay for cancelled order');

        // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
        // create a charge using stripe api
        const charge = await stripe.charges.create({
          amount: order.price * 100,
          currency: 'usd',
          source: token
        });

        const payment = Payment.build({
            stripeId: charge.id,
            orderId,
        });
        await payment.save();

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId,
        });

        res.status(201).send(payment);
    }
);

export { router as createChargeRouter };