const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { httpSendEmail } = require('../controllers/emails.controller');

const emailRouter = express.Router();

emailRouter.route('/send-message').post(authMiddleware, httpSendEmail);

module.exports = emailRouter;
