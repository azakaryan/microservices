const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {

    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] }; 
    } else if (type === 'CommentCreated') {
        const { id, content, status, postId } = data;

        posts[postId].comments.push({ id, content, status });
    } else if (type === 'CommentUpdated') {
        const { id, content, status, postId } = data;
        const comment = posts[postId].comments.find(c => c.id === id);

        comment.status = status;
        comment.content = content;
    }
}

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.status(201).send({});
})

app.get('/query', (req, res) => {
    res.send(posts);
})

app.listen(4002, async () => {
    console.log('Query Service: Listening on 4002');

    const res = await axios.get('http://event-bus-srv:4005/events');

    for (let event of res.data) {
        console.log('processing event:: ', event.type);
        handleEvent(event.type, event.data);
    }
});