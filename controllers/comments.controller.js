const { isObjectIdOrHexString } = require('mongoose');
const Comment = require('../models/Comment');
const errorJson = require('./utils/errorLog');

async function httpCreateComment(req, res, next) {
  const { _id } = req.user;
  const { postId } = req.body;
  try {
    if (!isObjectIdOrHexString(postId))
      throw new Error('Wrong mongoose Object Id');
    const comment = await Comment.create({
      ...req.body,
      post: postId,
      author: _id,
    });
    res.status(201).json({
      message: 'Succes comment created',
      data: {
        comment,
      },
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpFetchComment(req, res, next) {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id).populate(['author', 'post']);
    res.status(200).json({
      message: 'success fetching comment',
      data: comment,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}
async function httpUpdateComment(req, res, next) {
  const { id } = req.params;

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        commentBody: req.body.commentBody,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      message: 'success updating comment',
      data: comment,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}
async function httpDeleteComment(req, res, next) {
  const { id } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.status(201).json({
      message: 'success deleting comment',
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpFetchComments(req, res, next) {
  try {
    const comments = await Comment.find({}).populate(['author', 'post']);
    res.status(200).json({
      message: 'success fetching comments',
      data: comments,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

module.exports = {
  httpCreateComment,
  httpFetchComment,
  httpUpdateComment,
  httpDeleteComment,
  httpFetchComments,
};
