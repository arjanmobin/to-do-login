// Node Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const authRoute = require('./routes/authRoutes.js');
const mongoose = require('./db/mongoose.js');

// Setup
const port = process.env.PORT || 3000;
const app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));

app.get('/', (req, res) => {
    res.render('index');
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

// Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.errorMessages = req.flash('errorMessages');
  res.locals.successMessage = req.flash('successMessage');
  next();
})

// Mount Routes
app.use('/', authRoute)

app.listen(port, () => {
    console.log(`Web serber up on port ${port}`);
})
