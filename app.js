const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { centerErrorHandler } = require('./middlewares/centerErrorHandler');
const { signinValidate, signupValidate } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.post('/signup', signupValidate, createUser);
app.post('/signin', signinValidate, login);
app.use(auth, router);
app.use(centerErrorHandler);
app.listen(PORT);
