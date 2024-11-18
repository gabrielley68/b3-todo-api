// const logger = require('./logger');
// const express = require('express');
// const request = require('supertest');
// const fs = require('fs');
// const path = require('path');

// const app = express();

// describe.skip('logger middleware', () => {
//     app.use(logger);
//     app.get('/test', (req, res) => {
//         res.status(200).send("Ok");
//     });

//     const TMP_LOG_DIR = path.join(__dirname, 'test_logs');

//     beforeAll(() => {
//         process.env.LOGS_DIR = TMP_LOG_DIR;
//     });

//     afterAll(async () => {
//         await fs.rm(TMP_LOG_DIR, {recursive: true, force: true});
//     });

//     test('create log file on request', async () => {
//         jest.useFakeTimers();
//         jest.setSystemTime(new Date(2024, 11, 18));
//         const response = await request(app).get('/test');

//         expect(response.status).toBe(200);
//     });
// });