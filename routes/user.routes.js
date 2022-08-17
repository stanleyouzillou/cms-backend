const express = require('express');
const isValidObjectId = require('../controllers/utils/isValidObjectId');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  photoUploadMiddleware,
  resizePhotoMiddleware,
} = require('../middlewares/uploadPhotoMiddleware');
const {
  httpPostUser,
  httpUserLogin,
  httpFetchAllUsers,
  httpFetchUser,
  httpDeleteUser,
  httpUserProfile,
  httpUpdateProfile,
  httpUpdatePassword,
  httpFollowUser,
  httpUnfollowUser,
  httpBlockUser,
  generateVerificationToken,
  verifyToken,
  generatePasswordToken,
  verifyPasswordToken,
  httpProfilePhotoUpload,
} = require('../controllers/users.controller');

const userRouter = express.Router();

userRouter.get('/users', authMiddleware, httpFetchAllUsers);
userRouter.post('/users/login', httpUserLogin);
userRouter.post('/users/register', httpPostUser);

userRouter
  .route('/users/:id')
  .get(isValidObjectId, httpFetchUser)
  .delete(isValidObjectId, httpDeleteUser);

userRouter
  .route('/users/profile/:id')
  .get(isValidObjectId, authMiddleware, httpUserProfile)
  .put(authMiddleware, httpUpdateProfile);

userRouter.put('/users/password/:id', authMiddleware, httpUpdatePassword);
userRouter.post('/users/follow', authMiddleware, httpFollowUser);
userRouter.post('/users/unfollow', authMiddleware, httpUnfollowUser);
userRouter.put('/users/block/:id', authMiddleware, httpBlockUser);
userRouter.post('/users/send-token', generateVerificationToken);
userRouter.post('/users/verif-token', verifyToken);
userRouter.post('/users/reset-password', generatePasswordToken);
userRouter.post('/users/verif-password-token', verifyPasswordToken);

userRouter.put(
  '/users/profilephoto-upload',
  authMiddleware,
  photoUploadMiddleware.single('image'),
  resizePhotoMiddleware('PROFILE'),
  httpProfilePhotoUpload
);
module.exports = userRouter;
