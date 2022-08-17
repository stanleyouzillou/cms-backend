const mongoose = require('mongoose');

const Category = require('../models/Category');

const errorJson = require('./utils/errorLog');

async function httpCreateCategory(req, res, next) {
  const { categoryTitle } = req.body;
  try {
    const category = await Category.create({
      categoryTitle,
    });
    res.status(201).json({
      message: 'Success category created',
      data: category,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpUpdateCategory(req, res, next) {
  const { id } = req.params;
  const { categoryTitle } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        categoryTitle,
      },
      {
        new: true,
      }
    );
    res.status(202).json({
      message: 'Success category updated',
      data: category,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpFetchCategory(req, res, next) {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    res.status(200).json({
      message: 'Success category fetched',
      data: category,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpDeleteCategory(req, res, next) {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    res.status(203).json({
      message: 'Success category deleted',
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpFetchCategories(req, res, next) {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      message: 'Success categories fetched',
      data: categories,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

module.exports = {
  httpCreateCategory,
  httpFetchCategories,
  httpFetchCategory,
  httpUpdateCategory,
  httpDeleteCategory,
};
