const express = require('express');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());


app.post('/events', (req, res) => {
    const event = req.body;

    axios.post('http://localhost:4000/events', event).catch((err) => console.log('Error when sending event to <Posts>'));
    axios.post('http://localhost:4001/events', event).catch((err) => console.log('Error when sending event to <Comments>'));
    axios.post('http://localhost:4002/events', event).catch((err) => console.log('Error when sending event to <Query service>'));

    res.send({ status: 'OK '});
});

app.listen(4005, () => {
    console.log('Event BUS: Listening on 4005');
});