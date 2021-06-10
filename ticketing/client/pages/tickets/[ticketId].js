import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id }
  });

  const makeOrder = async () => {
    try {
      const order = await doRequest();

      Router.push('/orders/[orderId]', `/orders/${order.id}`)
    } catch( err ) {

    }
  }

  return <div>
    <h2>{ticket.title}</h2>
    <h4>Price: {ticket.price}</h4>
    {errors}
    <button className="btn btn-primary" onClick={makeOrder}>Purchase</button>
  </div>
}

TicketShow.getInitialProps = async ({ Component, query }, client, currentUser) => {
  const { ticketId } = query
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  
  return { ticket: data };
}

export default TicketShow;