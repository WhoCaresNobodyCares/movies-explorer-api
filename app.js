const express = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const authorization = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, DB_LINK, NODE_ENV } = process.env;

express.use(limiter);
express.use(helmet());
express.use(bodyParser.json());

mongoose.connect(NODE_ENV === 'production' ? DB_LINK : 'mongodb://localhost:27017/moviesdb', { useNewUrlParser: true, family: 4 })
  .then(() => { express.listen(PORT, () => { console.log(`Connected to moviesdb on port ${PORT}`); }); })
  .catch((err) => console.log(err));

express.use(requestLogger);

express.use('/', require('./routes/auth'));

express.use(authorization);

express.use('/users', require('./routes/user'));
express.use('/movies', require('./routes/movie'));

express.use((req, res, next) => next(new NotFoundError('404: not found error')));

express.use(errorLogger);
express.use(errors());
express.use(errorHandler);
