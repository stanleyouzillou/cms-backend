const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleWare(req, res, next) {
  // let token;
  if (req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET); // return payload {id: id}
        const user = await User.findById(decoded.id).select('-password'); //throw error if not found so no need for else
        req.user = user;
        next();
      } else {
        throw new Error('There is no token attached to the header');
      }
    } catch (error) {
      console.log(error.message);
      next('Not authorized, login again ');
    }
  } else {
    next('There is no Bearer specified');
  }
}

module.exports = authMiddleWare;
