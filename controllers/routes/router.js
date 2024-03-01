const express=  require('express');
const { loginWithEmail, verifyOTPForLogin } = require('../auth/login');
const { register, verifyOTPForSignup } = require('../auth/register');
const { sendMail } = require('../mailer');
const { SendMail } = require('../sendmail');
const { userAuth } = require('../../middleware/auth');
const { getUser } = require('../getuser');
const router = express.Router();

router.route('/login').post(loginWithEmail)
router.route('/login/verify').post(verifyOTPForLogin);
router.route('/register').post(register);
router.route('/register/verify').post(verifyOTPForSignup)
router.route('/send/mail').post(SendMail);
router.route('/get/user').get(userAuth , getUser);

module.exports = router;
