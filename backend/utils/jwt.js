const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
};

exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
