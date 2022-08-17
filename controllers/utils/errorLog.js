module.exports = function errorJson(error, res, next) {
  if (typeof error === 'string') {
    res.status(400).json({
      message: error,
    });
    next(error);
  } else {
    res.status(400).json({
      error: error.message,
      stack: error.stack,
    });
    next(error.message);
    console.log(error);
  }
};
