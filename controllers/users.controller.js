const fs = require('fs');
const path = require('path');
const { isObjectIdOrHexString } = require('mongoose');
const crypto = require('crypto');
const User = require('../models/User');

const errorJson = require('./utils/errorLog');
const cloudinaryUploadImg = require('./utils/cloudinary');
const generateToken = require('../config/token/generateToken');
const { sendEmailSendgrind, TOKEN_MSG } = require('./utils/sendGrid');

async function httpPostUser(req, res, next) {
  const { firstName, lastName, email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400).json({
      message: 'User already exist',
    });
    next('User already exist');
  } else {
    try {
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: req?.body?.password,
      });
      res.status(201).json({
        message: 'New user added to db',
        data: {
          firstName: newUser?.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          profilePhoto: newUser.profilePhoto,
          isAdmin: newUser.isAdmin,
        },
      });
    } catch (error) {
      errorJson(error, res, next);
    }
  }
}

async function httpUserLogin(req, res, next) {
  const user = await User.findOne({ email: req.body.email });
  const passwordMatched = await user?.isPasswordMatched(req.body.password);
  if (!user || !passwordMatched) {
    res.status(400).json({
      message: 'Login credentials are not valid',
    });
    next('Login credentials are not valid');
  } else {
    try {
      res.status(200).json({
        message: 'User Login',
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePhoto: user.profilePhoto,
          isAdmin: user.isAdmin,
          generateToken: generateToken(user._id),
        },
      });
    } catch (error) {
      errorJson(error, res, next);
    }
  }
}

async function httpFetchAllUsers(req, res, next) {
  const users = await User.find({});
  try {
    res.status(200).json({
      message: 'Sucess',
      data: users,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpDeleteUser(req, res, next) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(202).json({
      message: 'User deleted',
      data: deletedUser,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpFetchUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    res.status(202).json({
      message: 'User found',
      data: user,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpUserProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.id).populate('posts');
    res.status(200).json({
      message: 'User profile',
      data: user,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpUpdateProfile(req, res, next) {
  const { _id } = req.user;
  const { firstName, lastName, email, bio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        email,
        bio,
      },
      { new: true, runValidators: true }
    );
    res.status(201).json({
      message: 'User updated',
      data: user,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpUpdatePassword(req, res, next) {
  const { _id } = req.user;
  const { password } = req.body;

  try {
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updateUser = await user.save();
      res.json({
        data: updateUser,
      });
    }
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpFollowUser(req, res, next) {
  const { _id } = req.user;
  const { followId } = req.body;
  if (!isObjectIdOrHexString(_id) || !isObjectIdOrHexString(followId)) {
    errorJson('Invalid mongoose ID', res, next);
  } else {
    try {
      const user = await User.findById(_id);
      const userToFollow = await User.findById(followId);
      if (user.following.indexOf(followId) === -1) {
        await user.following.push(followId);
        await user.save();
        await userToFollow.followers.push(_id);
        await userToFollow.save();
        res.status(201).json({
          message: 'Follower / following logic success',
        });
      } else {
        errorJson('Already following that user', res, next);
      }
    } catch (error) {
      errorJson(error, res, next);
    }
  }
}

async function httpUnfollowUser(req, res, next) {
  const { _id } = req.user;
  const { followId } = req.body;
  if (!isObjectIdOrHexString(_id) || !isObjectIdOrHexString(followId)) {
    errorJson('Invalid mongoose ID', res, next);
  } else {
    try {
      const user = await User.findById(_id);
      const userToFollow = await User.findById(followId);
      const indexFollowing = user.following.indexOf(followId);
      const indexFollower = userToFollow.following.indexOf(_id);
      if (indexFollowing > -1) {
        await user.following.splice(indexFollowing, 1);
        await user.save();
        await userToFollow.followers.splice(indexFollower, 1);
        await userToFollow.save();
        res.status(201).json({
          message: 'Unfollowing logic success',
        });
      } else {
        errorJson('You need to follow first to be able to unfollow', res, next);
      }
    } catch (error) {
      errorJson(error, res, next);
    }
  }
}

async function httpBlockUser(req, res, next) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked
        ? 'Success user blocked'
        : 'Success user unblocked',
      data: user,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function generateVerificationToken(req, res, next) {
  try {
    const user = await User.findById(req.body.id);
    const token = await user.generateVerifToken();
    const html = `You've received this email to verify your account
    verify now within 10 minutes <a href=http://localhost:3000/verif-token/${token}> Verify </a>`;

    await sendEmailSendgrind(TOKEN_MSG, html);
    res.json({
      message: 'Success email token sent',
      body: html,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function verifyToken(req, res, next) {
  const { token } = req.body;
  try {
    const hashToken = await crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user = await User.findOne({ accountVerificationToken: hashToken });
    if (user && Date.now() <= user.accountVerificationTokenExpires) {
      user.isAccountVerified = true;
      user.accountVerificationToken = undefined;
      user.accountVerificationTokenExpires = undefined;
      await user.save();
      res.status(201).json({
        message: 'Sucess token verified',
        data: user,
      });
    } else {
      throw new Error('Wrong token or link expired');
    }
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function generatePasswordToken(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    const passwordToken = await user.generatePasswordToken();
    const html = `You've received this email to verify your account
    verify now within 10 minutes <a href=http://localhost:3000/password-token/${passwordToken}> Verify </a>`;

    await sendEmailSendgrind(TOKEN_MSG, html);
    res.json({
      message: 'Success email token sent',
      body: html,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function verifyPasswordToken(req, res, next) {
  const { token, password } = req.body;
  try {
    const hashPasswordToken = await crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user = await User.findOne({ passwordResetToken: hashPasswordToken });
    if (user && Date.now() <= user.passwordResetExpires) {
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      res.status(201).json({
        message: 'Sucess password reset',
        data: user,
      });
    } else {
      throw new Error('Wrong token or link expired');
    }
  } catch (error) {
    errorJson(error, res, next);
  }
}

async function httpProfilePhotoUpload(req, res, next) {
  const { _id } = req.user;
  const pathFile = path.resolve(
    __dirname,
    '..',
    'public',
    'images',
    'profiletmp',
    req.file.filename
  );

  try {
    const user = await User.findById(_id);
    const asset = await cloudinaryUploadImg(pathFile);
    user.profilePhoto = asset.secure_url;
    user.save();
    res.status(200).json({
      message: 'profile photo uploaded to Cloudinary',
      data: asset,
    });
    fs.unlinkSync(pathFile);
  } catch (error) {
    errorJson(error, res, next);
  }
}

module.exports = {
  httpPostUser,
  httpUserLogin,
  httpFetchAllUsers,
  httpFetchUser,
  httpUserProfile,
  httpUpdateProfile,
  httpDeleteUser,
  httpUpdatePassword,
  httpFollowUser,
  httpUnfollowUser,
  httpBlockUser,
  generateVerificationToken,
  verifyToken,
  generatePasswordToken,
  verifyPasswordToken,
  httpProfilePhotoUpload,
};
