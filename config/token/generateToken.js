const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '20d',
  });
}

module.exports = generateToken;
