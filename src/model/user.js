const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    creditCardNumber: {
        type: String,
        required: true,
    },
    creditCardExpiry: {
        type: String,
        required: true,
    },
    creditCardCVC: {
        type: String,
        required: true,
    },
    images: [{ type: String }],
    otp: { type: String },
    otpExpires: { type: Date },
    googleId: { type: String },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
