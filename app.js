const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

require('./models');

const indexRouter = require('./routes/index');
const taskRouter = require('./routes/tasks');
const legacyTaskRouter = require('./routes/legacy_task');
const authRouter = require('./routes/auth');

const logger = require('./middlewares/logger');

const app = express();

// app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    req.test = "Salut ça va ?";
    next();
});
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log("Fin de la requête");
    });
    next();
});

app.use(logger);

app.use('/', indexRouter);
app.use('/tasks', taskRouter);
app.use('/legacy/tasks', legacyTaskRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    res.status(404);
    res.send("Page not found");
});

module.exports = app;
