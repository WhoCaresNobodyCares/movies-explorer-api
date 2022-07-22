const express = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const authorization = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', { useNewUrlParser: true, family: 4 })
  .then(() => { express.listen(PORT, () => { console.log(`Connected to bitfilmsdb on port ${PORT}`); }); })
  .catch((err) => console.log(err));

express.use(bodyParser.json());

express.use(requestLogger);

express.use('/', require('./routes/auth'));

express.use(authorization);

express.use('/users', require('./routes/user'));
express.use('/movies', require('./routes/movie'));

express.use((req, res, next) => next(new NotFoundError('404: not found error')));

express.use(errorLogger);

express.use(errors());

express.use((err, req, res, next) => {
  if (!err.statusCode) { res.status(500).send({ message: 'ErrorHandler: server error' }); }
  res.status(err.statusCode).send({ message: err.message });
  // next();
});
