var express = require('express');
var router = express.Router();
const mongoDB = require('../mongodb/mongo');

// notedev: view redirect all goes here

router.get('/test', (req, res) => {
  return res.json({ message: 'Hello from the test route!' });
});

router.get('/', async (req, res) => {
  try {
    const db = await mongoDB.connectDB();
    const userCount = await db.collection('users').countDocuments();

    console.log(userCount)

    console.log('User count:', userCount); 
    res.render('index', { pageTitle: 'Home', error: null, userCount, user: req.session.user || null });
  } catch (error) {
    res.render('index', { pageTitle: 'Home', error: 'Failed to fetch user count', userCount: 0 });
  }
});

router.get('/signup', (req, res) => {
  res.render('signup', { pageTitle: 'Sign Up', error: null, user: req.session.user || null });
});

router.get('/login', (req, res) => {
  res.render('login', { pageTitle: 'Login', error: null, user: req.session.user || null });
});

module.exports = router;
