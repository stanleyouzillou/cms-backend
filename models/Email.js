const crypto = require('crypto');
const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "please provide sender's email"],
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "please provide recipent's email"],
    },
    subject: {
      type: String,
      required: [true, 'please provide an email subject'],
    },
    emailBody: {
      type: String,
      required: [true, 'please provide an email body'],
    },
  },
  {
    timestamps: true,
  }
);

EmailSchema.pre('save', async function (next) {
  this.subject = await crypto
    .createHash('sha256')
    .update(this.subject)
    .digest('hex');
  this.emailBody = await crypto
    .createHash('sha256')
    .update(this.emailBody)
    .digest('hex');
  next();
});

module.exports = mongoose.model('Email', EmailSchema);
