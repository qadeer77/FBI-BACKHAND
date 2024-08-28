const User = require('../model/user');

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: 'Email, new password, and confirm password are required',
                errors: {
                    email: !email ? 'Email is required' : undefined,
                    newPassword: !newPassword ? 'New password is required' : undefined,
                    confirmPassword: !confirmPassword ? 'Confirm password is required' : undefined,
                }
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'No user found with this email' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { resetPassword };
