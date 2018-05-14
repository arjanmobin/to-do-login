// Node Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
