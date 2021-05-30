import request from 'supertest';
import { app } from '../../app';

it('returns 201 on signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);
});

it('returns 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testestcom',
            password: 'password',
        })
        .expect(400);
});

it('returns 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'p',
        })
        .expect(400);
});

it('returns 400 with missing email & password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
        })
        .expect(400);
    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password'
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(409);
});

it('it sets a cookie after successful signup', async () => {
    const resp = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);

    const cookie = resp.get('Set-Cookie');
    expect(cookie).toBeDefined();
});



