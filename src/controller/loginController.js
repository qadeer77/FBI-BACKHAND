const jwt = require('jsonwebtoken');
const User = require('../model/user');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                errors: {
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined,
                }
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format',
                errors: { email: 'Please enter a valid email address' }
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret_key', {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                DOB: user.DOB,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { login };
