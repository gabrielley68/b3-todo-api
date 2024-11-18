indexRouter = require('./index');
express = require('express');
request = require('supertest');

app = express();
app.use('/', indexRouter)

describe('Index router', () => {
    test('display message', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello world v3');
    });
});