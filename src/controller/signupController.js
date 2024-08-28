const jwt = require('jsonwebtoken');
const User = require('../model/user');
const nodemailer = require('nodemailer');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendOtpEmail = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "preetkumar1970@gmail.com",
            pass: "qgun ookb ndqh dwbn",
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
    };

    return transporter.sendMail(mailOptions);
};

const validateCreditCardNumber = (number) => {
    const sanitized = number.replace(/[^0-9]/g, '');
    let sum = 0;
    let shouldDouble = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized[i]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dob, creditCardNumber, creditCardExpiry, creditCardCVC } = req.body;

        if (!firstName || !lastName || !email || !password || !dob || !creditCardNumber || !creditCardExpiry || !creditCardCVC) {
            return res.status(400).json({
                message: 'All fields are required',
                errors: {
                    firstName: !firstName ? 'firstName is required' : undefined,
                    lastName: !lastName ? 'lastName is required' : undefined,
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined,
                    dob: !dob ? 'Date of Birth is required' : undefined,
                    creditCardNumber: !creditCardNumber ? 'Credit Card Number is required' : undefined,
                    creditCardExpiry: !creditCardExpiry ? 'Credit Card Expiry is required' : undefined,
                    creditCardCVC: !creditCardCVC ? 'Credit Card CVC is required' : undefined,
                }
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format',
                errors: { email: 'Please enter a valid email address' }
            });
        }

        if (!validateCreditCardNumber(creditCardNumber)) {
            return res.status(400).json({
                message: 'Invalid credit card number',
                errors: { creditCardNumber: 'Please enter a valid credit card number' }
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOtp();
        const otpExpires = Date.now() + 2 * 60 * 1000;

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            dob,
            creditCardNumber,
            creditCardExpiry,
            creditCardCVC,
            otp,
            otpExpires,
        });

        await user.save();
        await sendOtpEmail(email, otp);

        const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret_key', {
            expiresIn: '1h',
        });

        res.status(201).json({
            message: 'User registered successfully. Please check your email for the OTP code.',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dob: user.dob,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { signup };
