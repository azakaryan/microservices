const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/posts', (req, res) => {
    console.log('Create post');
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = { id, title };
    res.status(201).send(posts[id]);
})

app.get('/posts', (req, res) => {
    console.log('get posts');
    res.send(posts);
})

app.listen(4000, () => {
    console.log('POSTS: Listening on 4000');
});