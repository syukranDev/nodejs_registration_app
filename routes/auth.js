const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

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

        req.session.user = { id: user._id, username: user.username };
        res.redirect('/');
    } catch (error) {
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

module.exports = router;
