const express = require('express');
const auth = express.Router();
const { body, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const bcrypt = require('bcryptjs');
const {validateUser} = require('../middleware/middleware');

const User = require("../models/user");

auth.get("/register", (req, res)=>{
  res.render("register");
});

auth.post("/register",
  [
  body("username")
    .isLength({min: 4})
    .withMessage("Username must be at least 4 characters")

  ],

  (req, res)=>{
    
})


auth.get("/home", validateUser, (req, res)=>{
  res.render("home");
});
