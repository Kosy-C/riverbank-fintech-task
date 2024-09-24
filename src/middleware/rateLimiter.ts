import rateLimit from "express-rate-limit";

export const apiLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many requests from this IP, please try again later.',
});