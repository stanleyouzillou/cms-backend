const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  photoUploadMiddleware,
  resizePhotoMiddleware,
} = require('../middlewares/uploadPhotoMiddleware');
const isValidObjectId = require('../controllers/utils/isValidObjectId');

const postRouter = express.Router();

const {
  httpCreatePost,
  httpFetchPost,
  httpFetchAllPosts,
  httpUpdatePost,
  httpDeletePost,
  toggleLikeDislikeController,
} = require('../controllers/posts.controller');

postRouter
  .route('/posts/:id')
  .get(isValidObjectId, httpFetchPost)
  .put(authMiddleware, isValidObjectId, httpUpdatePost)
  .delete(authMiddleware, isValidObjectId, httpDeletePost);
postRouter
  .route('/posts')
  .get(authMiddleware, httpFetchAllPosts)
  .post(
    authMiddleware,
    photoUploadMiddleware.single('image'),
    resizePhotoMiddleware('POST'),
    httpCreatePost
  );
postRouter
  .route('/posts/like')
  .post(authMiddleware, toggleLikeDislikeController);

module.exports = postRouter;
