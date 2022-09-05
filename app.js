require('dotenv').config();
const express = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const authorization = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');
const errorHandler = require('./middlewares/errorHandler');

const { DEV_DB_LINK, SUCCESS_MESSAGE, NOT_FOUND_MESSAGE } = require('./config.json');

const { PORT = 3001, DB_LINK, NODE_ENV } = process.env;

// const allowedCors = [
//   'https://andrewdiploma.nomoredomains.xyz.nomoredomains.sbs',
//   'http://andrewdiploma.nomoredomains.xyz.nomoredomains.sbs',

// ];

express.use(cors({ origin: 'https://andrewdiploma.nomoredomains.xyz.nomoredomains.sbs', credentials: true }));

express.use(requestLogger);
express.use(limiter);
express.use(helmet());
express.use(bodyParser.json());

mongoose.connect(NODE_ENV === 'production' ? DB_LINK : DEV_DB_LINK, { useNewUrlParser: true, family: 4 })
  .then(() => { express.listen(PORT, () => { console.log(`${SUCCESS_MESSAGE} ${PORT}`); }); })
  .catch((error) => console.log(error));

express.use(require('./routes/auth'));

express.use(authorization);

express.use(require('./routes/user'));
express.use(require('./routes/movie'));

express.use((req, res, next) => next(new NotFoundError(`${NOT_FOUND_MESSAGE}`)));

express.use(errorLogger);
express.use(errors());
express.use(errorHandler);
