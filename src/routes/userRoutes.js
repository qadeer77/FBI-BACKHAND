const express = require('express');
const { signup } = require('../controller/signupController');
const { login } = require('../controller/loginController');
const { resetPassword } = require('../controller/passwordResetController');
const { verifyOtp } = require('../controller/otpController');
const { uploadImages } = require('../controller/imageController');
const passport = require('passport');
const upload = require('../middleware/multerConfig');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/verify-otp', verifyOtp);
router.post('/upload-images', upload.array('images', 5), uploadImages);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { 
    successRedirect: '/api/auth/google/success',
    failureRedirect: '/api/auth/google/failure'
}));

router.get('/auth/google/success', (req, res) => {
    res.status(200).json({ message: 'Google authentication successful', user: req.user });
});

router.get('/auth/google/failure', (req, res) => {
    res.status(401).json({ message: 'Google authentication failed' });
});

module.exports = router;
