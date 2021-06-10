import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price }
  });

  const onBlur = (e) => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await doRequest();
      Router.push('/');
    } catch {}
  }

  return <div>
    <h3>Create a ticket</h3>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
      </div>
      <div className="form-group">
      <label>Price</label>
        <input value={price} onBlur={onBlur} onChange={(e) => setPrice(e.target.value)} className="form-control" />
      </div>
      { errors }
      <button style={{'margin-top': '10px'}} className="btn btn-primary">Submit</button>
    </form>
  </div>
}

export default NewTicket;