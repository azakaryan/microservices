const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const postId = req.params.id;
    const { content } = req.body;

    console.log('Create comment with data: ', content);

    const comments = commentsByPostId[postId] || [];

    comments.push({ id: commentId, content });
    commentsByPostId[postId] = comments;

    res.status(201).send(comments);
})

app.get('/posts:id/comments', (req, res) => {
    const postId = req.params.id;
    console.log('get posts');
    res.send(commentsByPostId[postId] || []);
})

app.listen(4001, () => {
    console.log('COMMENTS: Listening on 4001');
});