const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false
}));

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else {
            return res.status(500).json({ message: err.message });
        }
    }
    next();
});

module.exports = app;
