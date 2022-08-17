const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { Schema } = mongoose;

const AVATAR_DEFAULT =
  'https://e7.pngegg.com/pngimages/442/477/png-clipart-computer-icons-user-profile-avatar-profile-heroes-profile.png';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    profilePhoto: { type: String, default: AVATAR_DEFAULT },
    email: { type: String, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'password is required'] },
    bio: { type: String },
    postCount: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['admin', 'guest', 'blogger'],
      default: 'blogger',
    },
    isFollowing: { type: Boolean, default: false },
    isUnFollowing: { type: Boolean, default: false },
    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewedBy: {
      type: [{ type: Schema.Types.ObjectID, ref: 'User' }],
      ref: 'User',
    },
    followers: {
      type: [{ type: Schema.Types.ObjectID, ref: 'User' }],
      ref: 'User',
    },
    following: {
      type: [{ type: Schema.Types.ObjectID, ref: 'User' }],
      ref: 'User',
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: String,
    active: { type: Boolean, default: false },
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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'author',
  localField: '_id',
});
UserSchema.virtual('emailsSent', {
  ref: 'Email',
  foreignField: 'fromUser',
  localField: '_id',
});
UserSchema.virtual('emailsReceived', {
  ref: 'Email',
  foreignField: 'toUser',
  localField: '_id',
});

UserSchema.methods.isPasswordMatched = async function (loginPassword) {
  return await bcrypt.compare(loginPassword, this.password);
};

UserSchema.methods.generateVerifToken = async function () {
  const accountVerifToken = crypto.randomBytes(32).toString('hex');
  this.accountVerificationToken = crypto
    .createHash('sha256')
    .update(accountVerifToken)
    .digest('hex');
  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;
  this.save();
  return accountVerifToken;
};

UserSchema.methods.generatePasswordToken = async function () {
  const passwordToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(passwordToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  this.save();
  return passwordToken;
};

// UserSchema.pre('save', function (next) {
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) return next(err);
//     bcrypt.hash(this.password, salt, (err, hash) => {
//       if (err) return next(err);
//       this.password = hash;
//       next();
//     });
//   });
// });

module.exports = mongoose.model('User', UserSchema);
