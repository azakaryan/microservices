import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id }
  });

  const onTokenRecieve = async (token) => {
    try {
      await doRequest({token: token.id});
      Router.push('/orders');
    } catch( err ) {

    }
  }

  useEffect(() => {
    let refreshIntervalId;
  
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      const sLeft = msLeft / 1000;

      if (sLeft < 0) {
        setIsExpired(true);
        clearInterval(refreshIntervalId);
        return;
      }
      const minutes = Math.floor(sLeft / 60);
      const seconds = Math.floor(sLeft - minutes * 60);
      setTimeLeft(`${minutes && `${minutes}m`}: ${seconds && `${seconds}s`}`);
    };

    findTimeLeft();
    refreshIntervalId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(refreshIntervalId)
    }
  }, []);

  if (isExpired) {
    return <div>Order is Expired</div>
  }

  return <div>
    Left to pay: { timeLeft }
    <div>
      <StripeCheckout
        token={onTokenRecieve}
        amount={order.ticket.price * 100}
        email={currentUser.email}
        stripeKey="pk_test_51Izi5dHRmxrzKbO5XHY8J4NjWGXeFFKpiCvprLliUCEz8ER92HAhkCJoRPrAlIsxFCpdab1wQKTHeHZx1CKuvq2N002XPchUsR"
      ></StripeCheckout>
    </div>
    {errors}
  </div>
}

OrderShow.getInitialProps = async ({ Component, query }, client, currentUser) => {
  const { orderId } = query
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
}

export default OrderShow;