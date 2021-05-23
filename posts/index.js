const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/posts', async (req, res) => {
    console.log('Create post');
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = { id, title };

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: {
          id,
          title,
        }
    });

    res.status(201).send(posts[id]);
})

app.get('/posts', (req, res) => {
    console.log('get posts');
    res.send(posts);
})

app.post('/events', (req, res) => {
    console.log('Event recieved', req.body.type);
    res.send({});
})

app.listen(4000, () => {
    console.log('Running Version: V3')
    console.log('POSTS: Listening on 4000');
});