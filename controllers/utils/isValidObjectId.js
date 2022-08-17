const mongoose = require('mongoose');

function isValidObjectId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({
      message: 'Invalid Mongoose Object Id',
    });
    throw new Error('Invalid Mongoose Object Id');
    next(error);
  } else {
    mongoose.isObjectIdOrHexString(id);
    next();
  }
}

module.exports = isValidObjectId;
