const rateLimit = require('express-rate-limit');

const limiter = rateLimit({ windowMs: 300000, max: 100, message: 'I am tired, please stop requesting me for some time' });

module.exports = limiter;
