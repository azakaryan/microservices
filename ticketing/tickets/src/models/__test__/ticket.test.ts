import { Ticket } from '../ticket';

it ('implements optimistic cuncurency control', async () => {
  // Create an instance of a ticket.
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  // Save it to database.
  await ticket.save();

  // fech the ticket twice.
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  
  // make two separate changes to the tickets we fetched.
  firstInstance!.set({
    title: 'new title 1',
    price: 10,
  });
  secondInstance!.set({
    title: 'new title 1',
    price: 100,
  })

  // save the first fetched ticket.
  await firstInstance!.save();

  // save the second fetched ticket and expect an error.
  try {
    await secondInstance!.save(); 
  } catch(err) {
    return;
  }

  throw new Error('should\'t reach this point if throws');
});

it ('increments version number on each save', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});
