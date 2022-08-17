const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Filter = require('bad-words');
const Post = require('../models/Post');

const errorJson = require('./utils/errorLog');
const cloudinaryUploadImg = require('./utils/cloudinary');

async function httpCreatePost(req, res, next) {
  const author = req.user._id;
  const { title, postBody, category } = req.body;
  const filter = new Filter();
  const pathFile = path.resolve(
    __dirname,
    '..',
    'public',
    'images',
    'blogtmp',
    req.file.filename
  );

  if (mongoose.isObjectIdOrHexString(author)) {
    try {
      const asset = await cloudinaryUploadImg(pathFile);
      const post = await Post.create({
        title: filter.clean(title),
        postBody: filter.clean(postBody),
        postImgUrl: asset?.secure_url,
        author,
        ...req.body,
      });
      fs.unlinkSync(pathFile);
      res.status(201).json({
        message: 'Succes post created',
        data: post,
      });
    } catch (error) {
      errorJson(error, res, next);
    }
  } else {
    const err = 'User is is not a valid Mongoose ObjectId';
    errorJson(err, res, next);
  }
}

async function httpUpdatePost(req, res, next) {
  try {
    const post = await Post.findOneAndUpdate(
      req.params.id,
      {
        ...req.body,
        author: req.params.id,
      },
      {
        new: true,
      }
    ).populate('author');
    res.status(201).json({
      message: 'Success post updated',
      data: post,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpFetchPost(req, res, next) {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    ).populate(['author', 'likes', 'dislikes']);
    res.status(200).json({
      message: 'Success fetched post by id',
      data: post,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpDeletePost(req, res, next) {
  try {
    const post = await Post.findByIdAndRemove(req.params.id, {
      select: 'title',
    });
    res.status(202).json({
      message: 'Post deleted',
      data: post,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpFetchAllPosts(req, res, next) {
  try {
    const posts = await Post.find({}).populate('author');
    res.status(200).json({
      message: 'Succes fetched all posts',
      data: posts,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function toggleLikeDislikeController(req, res, next) {
  const { like } = req.body.payload;
  const { postId } = req.body;
  //1 - if LIKE and already in LIKES removes from likes
  //2 - if LIKE and not already in LIKE and not in Dislike add in LIKE
  //3 - if LIKE and in Dislike remove from dislike and in like
  const userId = req.user._id;
  try {
    const post = await Post.findById(postId);
    const indexOfUserLikes = post.likes.indexOf(userId);
    const indexOfUserDislikes = post.dislikes.indexOf(userId);
    switch (like) {
      case 'LIKE':
        if (indexOfUserLikes !== -1) {
          post.likes.splice(indexOfUserLikes, 1);
          await post.save();
          res.json({
            data: {
              countLikes: post.likes.length,
              countDislikes: post.dislikes.length,
            },
          });
        } else if (indexOfUserLikes === -1 && indexOfUserDislikes === -1) {
          post.likes.push(userId);
          await post.save();
          res.json({
            data: {
              countLikes: post.likes.length,
              countDislikes: post.dislikes.length,
            },
          });
        } else if (indexOfUserLikes === -1 && indexOfUserDislikes !== -1) {
          post.likes.push(userId);
          post.dislikes.splice(indexOfUserDislikes, 1);
          await post.save();
          res.json({
            data: {
              countLikes: post.likes.length,
              countDislikes: post.dislikes.length,
            },
          });
        }
        break;
      case 'DISLIKE':
        indexOfUserDislikes;
        if (indexOfUserDislikes !== -1) {
          post.dislikes.splice(indexOfUserDislikes, 1);
          await post.save();
          res.json({
            data: {
              countLikes: post.likes.length,
              countDislikes: post.dislikes.length,
            },
          });
        } else if (indexOfUserLikes === -1 && indexOfUserDislikes === -1) {
          post.dislikes.push(userId);
          await post.save();
          res.json({
            data: {
              countLikes: post.likes.length,
              countDislikes: post.dislikes.length,
            },
          });
        } else if (indexOfUserDislikes === -1 && indexOfUserLikes !== -1) {
          post.dislikes.push(userId);
          post.likes.splice(indexOfUserLikes, 1);
          await post.save();
          res.json({
            data: {
              countLikes: post.likes.length,
              countDislikes: post.dislikes.length,
            },
          });
        }
        break;
      default:
        return undefined;
        break;
    }
    //Change like / dislike state
    if (post.likes.length > 0 && !post.isLiked) {
      post.isLiked = true;
      await post.save();
    } else if (post.dislikes.length > 0 && !post.isDisliked) {
      post.isDisliked = true;
      await post.save();
    } else {
      post.isLiked = false;
      post.isDisliked = false;
      await post.save();
    }
  } catch (error) {
    errorJson(error, res, next);
  }
}

module.exports = {
  httpCreatePost,
  httpFetchAllPosts,
  httpFetchPost,
  httpUpdatePost,
  httpDeletePost,
  toggleLikeDislikeController,
};
