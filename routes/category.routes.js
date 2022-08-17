const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const isValidObjectId = require('../controllers/utils/isValidObjectId');

const categoryRouter = express.Router();

const {
  httpCreateCategory,
  httpFetchCategories,
  httpFetchCategory,
  httpUpdateCategory,
  httpDeleteCategory,
} = require('../controllers/categories.controller');

categoryRouter
  .route('/categories/:id')
  .get(isValidObjectId, httpFetchCategory)
  .put(authMiddleware, isValidObjectId, httpUpdateCategory)
  .delete(authMiddleware, isValidObjectId, httpDeleteCategory);

categoryRouter
  .route('/categories')
  .get(authMiddleware, httpFetchCategories)
  .post(authMiddleware, httpCreateCategory);

module.exports = categoryRouter;
