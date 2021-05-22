const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const events = [];
const app = express();
app.use(bodyParser.json());


app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event);

    axios.post('http://localhost:4000/events', event).catch((err) => console.log('Error when sending event to <Posts>'));
    axios.post('http://localhost:4001/events', event).catch((err) => console.log('Error when sending event to <Comments>'));
    axios.post('http://localhost:4002/events', event).catch((err) => console.log('Error when sending event to <Query service>'));
    axios.post('http://localhost:4003/events', event).catch((err) => console.log('Error when sending event to <Moderation service>'));

    res.send({ status: 'OK '});
});


app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log('Event BUS: Listening on 4005');
});