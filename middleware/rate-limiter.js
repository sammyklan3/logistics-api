const rateLimit = require("express-rate-limit");

// Define the rate limiter settings
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    headers: true, // Adds X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset headers to responses
});

module.exports = limiter;