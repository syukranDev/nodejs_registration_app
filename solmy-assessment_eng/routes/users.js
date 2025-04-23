var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { connectDB, getNextUserId} = require('../mongodb/mongo');
const { Mutex } = require('async-mutex');
const signupMutex = new Mutex();

// notedev: optiop 1 signup: use transaction 
router.post('/signup', async (req, res) => {
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
        user: req.session.user || null,
        pageTitle: 'Sign Up',
        error: errors.join(', '),
      });
    }
  
    try {
      const db = await connectDB();
      const usersCollection = db.collection('users');
  
      const existingUser = await usersCollection.findOne({
        $or: [{ username }, { email }],
      });
  
      if (existingUser) {
        return res.render('signup', {
          user: req.session.user || null,
          pageTitle: 'Sign Up',
          error: 'Username or email already exists',
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const userId = await getNextUserId();
  
      const newUser = {
        userId,
        username,
        password: hashedPassword,
        email,
        createdAt: new Date(),
      };
  
      await usersCollection.insertOne(newUser);
  
      req.session.user = { id: newUser.userId, username: newUser.username };
      res.redirect('/');
    } catch (error) {
      console.error('Signup error:', error);
      res.render('signup', {
        user: req.session.user || null,
        pageTitle: 'Sign Up',
        error: error.message,
      });
    }
});

// notedev: option 2 signup: use mutex
// router.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;
//   const errors = [];

//   if (!username || username.length < 5) {
//     errors.push('Username must be at least 5 characters long');
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!email || !emailRegex.test(email)) {
//     errors.push('Invalid email format');
//   }

//   if (!password || password.length < 5) {
//     errors.push('Password must be at least 5 characters long');
//   }

//   if (errors.length > 0) {
//     return res.render('signup', {
//       user: req.session.user || null,
//       pageTitle: 'Sign Up',
//       error: errors.join(', '),
//     });
//   }

//   // Acquire the mutex to prevent race conditions
//   const release = await signupMutex.acquire();

//   try {
//     const db = await connectDB();
//     const usersCollection = db.collection('users');

//     const existingUser = await usersCollection.findOne({
//       $or: [{ username }, { email }],
//     });

//     if (existingUser) {
//       return res.render('signup', {
//         user: req.session.user || null,
//         pageTitle: 'Sign Up',
//         error: 'Username or email already exists',
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const userId = await getNextUserId();

//     const newUser = {
//       userId,
//       username,
//       password: hashedPassword,
//       email,
//       createdAt: new Date(),
//     };

//     await usersCollection.insertOne(newUser);

//     req.session.user = { id: newUser.userId, username: newUser.username };
//     res.redirect('/');
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.render('signup', {
//       user: req.session.user || null,
//       pageTitle: 'Sign Up',
//       error: error.message,
//     });
//   } finally {
//     // Release the mutex
//     release();
//   }
// });
  
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
        const db = await connectDB();
        const user = await db.collection('users').findOne({ username });

        if (!user) {
            return res.render('login', {
                user: req.session.user || null,
                pageTitle: 'Login',
                error: 'Invalid username or password'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', {
                user: req.session.user || null,
                pageTitle: 'Login',
                error: 'Invalid username or password'
            });
        }


        req.session.user = { id: user.userId, username: user.username };
        res.redirect('/');
  } catch (error) {
        res.render('login', {
            user: req.session.user || null,
            pageTitle: 'Login',
            error: error.message
        });
  }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.render('index', {
                user: req.session.user || null,
                pageTitle: 'Home',
                error: 'Failed to log out'
            });
        }
        res.redirect('/login');
    });
});

module.exports = router;
