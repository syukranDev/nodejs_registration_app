const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');
const authRoutes = require('./routes/auth');

const app = express();

// Connect to MongoDB
mongoose.connect('', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layout'); //notedev: set global layout

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.error = req.session.error || null;
    console.log('Session user:', req.session.user); //notedev: see if session user is set
    next();
});

app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Home' });
});

app.get('/signup', (req, res) => {
    res.render('signup', { pageTitle: 'Sign Up' });
});

app.get('/login', (req, res) => {
    res.render('login', { pageTitle: 'Login' });
});

app.use(authRoutes); 


const port = process.env.PORT || 3300;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});