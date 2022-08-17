const sgMail = require('@sendgrid/mail');

const TOKEN_MSG = {
  to: 'colp206@hotmail.com', // Change to your recipient
  from: 'stanmusic775@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'Token email',
  html: '',
};

async function sendEmailSendgrind(msg, html) {
  msg.html = html;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail.send(msg);
  console.log('Email sent');
}

module.exports = {
  TOKEN_MSG,
  sendEmailSendgrind,
};
