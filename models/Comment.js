const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A title is required'],
    },
    commentBody: {
      type: String,
      required: [true, 'Comment body is required'],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'post id is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'author id is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
