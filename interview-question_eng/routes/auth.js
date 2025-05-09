const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

router.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    const errors = [];

    if (!username || username.length < 5) {
        errors.push('Username must be at least 5 characters long');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Invalid email format');
    }

    if (!password || password.length < 5) {
        errors.push('Password must be at least 5 characters long');
    }

    if (errors.length > 0) {
        return res.render('signup', {
            pageTitle: 'Sign Up',
            error: errors.join(', ')
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.render('signup', {
                pageTitle: 'Sign Up',
                error: 'Username or email already exists'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        await session.commitTransaction();
        session.endSession();

        req.session.user = { id: user._id, username: user.username };
        res.redirect('/');
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.render('signup', {
            pageTitle: 'Sign Up',
            error: error.message
        });
    }
});

router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', {
                pageTitle: 'Login',
                error: 'Invalid username or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', {
                pageTitle: 'Login',
                error: 'Invalid username or password'
            });
        }

        req.session.user = { id: user._id, username: user.username };
        res.redirect('/');
    } catch (error) {
        res.render('login', {
            pageTitle: 'Login',
            error: error.message
        });
    }
});

// notedev: ignore this, this is for testing purposes
router.get('/api/registered_user_count', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.render('index', {
                pageTitle: 'Home',
                error: 'Failed to log out'
            });
        }
        res.redirect('/login');
    });
});


module.exports = router;
