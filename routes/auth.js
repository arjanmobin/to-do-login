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
    .withMessage("Username must be at least 4 characters"),
  body("password")
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters"),

    .matches(/\d/)
    .withMessage("Password must contain at least 1 number"),

  ],

  (req, res)=>{
    const errors = validationResult(req);
    if(!(errors.isEmpty())){
      const eMessages = errors.array().map(e =>{
        return {message: e.msg};
      });
      req.flash("eMessages", eMessages);
      res.redirect("/register");
    }
    else{
      const uData = matchedData(req);
      const user = new User(uData);
      user.save()
        .then((user)=>{
          req.flash("sMessages", {message: "Resgistration Success!"});
          res.redirect("/login");
        })
        .catch(e =>{
          req.flash("eMessages", {message: "Registration Failed."});
          if(e.code==11000){
            req.flash("eMessages", {message: "Account already exists. Please login"});
            res.redirect("/login");
          }
          else{
            res.redirect("/register");
          }
        })
    }
});

auth.get("/login", (req, res)=>{
  res.render("login");
});

auth.post("/login", (req, res)=>{
  User.find({email: req.body.email})
    .then(user=>{
      if(!user){
        req.flash("eMessages", {message: "Account does not exist"});
        res.redirect("/register");
      }
      else{
        bcrype.compare(req.body.password, user.password)
          .then(validPass=>{
            if(validPass){
              req.session.userId = user._id;
              res.redirect("/home");
            }
            else{
              req.flash("eMessages", {message: "Incorrect password"});
              res.redirect("/login");
            }
          })
          .catch(e=>{
            req.flash("eMessages", {message: "An error occured loggin in"});
          })
      }
    })
})


auth.get("/home", validateUser, (req, res)=>{
  res.render("home");
});
