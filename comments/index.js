const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const postId = req.params.id;
    const { content } = req.body;

    console.log('Create comment with data: ', content);

    const comments = commentsByPostId[postId] || [];
    const comment = { id: commentId, content, status: 'pending' };

    comments.push(comment);
    commentsByPostId[postId] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
          ...comment,  
          postId,
        }
    });

    res.status(201).send(comments);
})

app.get('/posts:id/comments', (req, res) => {
    const postId = req.params.id;
    console.log('get posts');
    res.send(commentsByPostId[postId] || []);
})

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, status, id } = data;
        
        const comment = commentsByPostId[postId].find(c => c.id === id);
        comment.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: { ...comment, postId },
        })
    }

    res.send({});
})

app.listen(4001, () => {
    console.log('COMMENTS: Listening on 4001');
});