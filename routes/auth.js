const express = require('express');
const auth = express.Router();
const { body, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const bcrypt = require('bcryptjs');
const {validateUser} = require('../middleware/middleware.js');
