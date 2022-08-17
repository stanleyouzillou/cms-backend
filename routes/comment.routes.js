const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const isValidObjectId = require('../controllers/utils/isValidObjectId');

const {
  httpCreateComment,
  httpFetchComment,
  httpUpdateComment,
  httpDeleteComment,
  httpFetchComments,
} = require('../controllers/comments.controller');

const commentRouter = express.Router();

commentRouter
  .route('/posts/comments/:id')
  .get(isValidObjectId, httpFetchComment)
  .put(authMiddleware, isValidObjectId, httpUpdateComment)
  .delete(authMiddleware, isValidObjectId, httpDeleteComment);
commentRouter
  .route('/posts/comments')
  .get(authMiddleware, httpFetchComments)
  .post(authMiddleware, httpCreateComment);

module.exports = commentRouter;
