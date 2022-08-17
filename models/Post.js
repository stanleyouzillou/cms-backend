const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    postBody: {
      type: String,
      required: [true, 'Please write a post content'],
    },
    postImgUrl: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2022/06/20/07/32/dirt-road-7273240_960_720.jpg',
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        red: 'Comment',
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please Author is required'],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostSchema);
