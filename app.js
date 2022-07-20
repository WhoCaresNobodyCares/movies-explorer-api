const express = require('express')();
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', { useNewUrlParser: true, family: 4 })
  .then(() => { express.listen(PORT, () => { console.log(`Connected to bitfilmsdb on port ${PORT}`); }); })
  .catch((err) => console.log(err));

express.use(requestLogger);

express.use('/', require('./routes/auth'));

express.use('/users', require('./routes/user'));
express.use('/movies', require('./routes/movie'));

express.use(errorLogger);
