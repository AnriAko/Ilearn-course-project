const rateLimit = require('express-rate-limit');

// no more that 100 request in 15 minutes
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
});

module.exports = limiter;