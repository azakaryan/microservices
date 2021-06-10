const OrderIndex = ({ orders, currentUser }) => {
  return orders.map((order) => (<ul>
    <li key={order.id}>
      {order.ticket.title} - {order.status}
    </li>
  </ul>));
}

OrderIndex.getInitialProps = async ({ Component, query }, client, currentUser) => {
  const { data } = await client.get(`/api/orders`);
  return { orders: data };
}

export default OrderIndex;