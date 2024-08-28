const jwt = require('jsonwebtoken');
const User = require('../model/user');

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'OTP verified successfully.', token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

module.exports = { verifyOtp };
