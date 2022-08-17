const { isObjectIdOrHexString } = require('mongoose');
const errorJson = require('./utils/errorLog');
const { sendEmailSendgrind } = require('./utils/sendGrid');

const Email = require('../models/Email');
const User = require('../models/User');

async function httpSendEmail(req, res, next) {
  const { _id } = req.user;
  const { recipientId, subject, emailBody } = req.body;

  try {
    const fromUser = await User.findById(_id, 'email');
    const toUser = await User.findById(recipientId, 'email');
    const USER_TO_USER_EMAIL = {
      to: toUser.email, // Change to your recipient
      from: fromUser.email, // Change to your verified sender
      subject,
      text: 'You just received a new email',
    };
    const EMAILHTML = `<p> Message: ${emailBody} </p>`;

    await sendEmailSendgrind(USER_TO_USER_EMAIL, EMAILHTML);

    const email = await Email.create({
      subject,
      emailBody,
      fromUser: fromUser.id,
      toUser: toUser.id,
    });
    res.status(200).json({
      message: 'Success email sent',
      data: email,
    });
  } catch (error) {
    errorJson(error, res, next);
  }
}

module.exports = {
  httpSendEmail,
};
