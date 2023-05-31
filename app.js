const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
const app = express();

app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '647700a34da07441b9763613',
  };

  next();
});

app.use(router);

app.listen(PORT);
