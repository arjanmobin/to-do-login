const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('./db/mongoose.js');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const User = require("./models/user");
const Todo = require("./models/todo");

const {body, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');

const {validateUser} = require('./middleware/middleware');

const port = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.successes = req.flash('successes');
  next();
})

//INDEX
app.get('/', (req, res) => {
  if(req.session.userId){
    res.redirect("/home");
  }
  else {
    res.render('index');
  }

});

//HOME - TODOS
app.get("/home", validateUser, (req, res)=>{
  Todo.find({
    user: req.session.userId
  })
  .then(todos=>{
    let incomplete = [];
    let complete = [];
    for (var i = 0; i < todos.length; i++) {
      if (!(todos[i].completed)) {
        incomplete.push(todos[i])
      }
      else {
        complete.push(todos[i])
      }
    }
    res.render("home", {
      complete,
      incomplete
    });
  })

})

//REGISTER
app.get("/register", (req, res)=>{
  res.render("register");
});

app.post("/register",
  [
  body("email")
    .isEmail()
    .withMessage("Not a valid email"),
  body("password")
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least 1 number")

  ],
 (req, res)=>{

  const errors = validationResult(req);
    if(!(errors.isEmpty())){
      const validationErrors = errors.array().map(e =>{
        return {message: e.msg};
      });
      req.flash("errors", validationErrors);
      res.redirect("/register");
    }
    else {
      console.log(matchedData(req))

      bcrypt.hash(matchedData(req).password, 10)
        .then(hashed => {
          user = new User({
            email: matchedData(req).email,
            password: hashed
          });
          return user.save()
        })
        .then(user=>{
          req.flash("successes", {
            message: "successesfully signed up"
          })
          res.redirect("/login");
        })
        .catch(e => {
          console.log(`An error occured signing up`, e);
          res.send(e)
          // res.redirect("/register");
        })
    }
});

app.get("/login", (req, res)=>{
  res.render("login");
});
app.post("/login", (req, res)=>{
  User.findOne({
    email: req.body.email
  })
  .then(user=>{
    if(!user){
      req.flash("errors", {
          message: "Account not found. Please sign up"
      })
      return res.redirect("/register");
    }
    else{
      bcrypt.compare(req.body.password, user.password)
      .then(valid=>{
        if(valid){
          req.session.userId = user._id;
          res.redirect("/home");
        }
        else{
          req.flash("errors", {
              message: "Incorrect password"
          });
          res.redirect("/login")
        }
      })
      .catch(e=>{
        console.log(e)

        req.flash("errors", {
            message: "An error occured logging in"
        });
      })
    }
  })
  .catch(e=>{
    console.log(e)
    req.flash("errors", {
        message: "An error occured logging in"
    });
  })
});

app.get("/new", validateUser, (req, res)=>{
  res.render("new");
});
app.post("/new", (req, res)=>{
  todo = new Todo({
    item: req.body.item,
    priority: req.body.priority,
    completed: false,
    user: req.session.userId
  })
  todo.save()
  .then(todo=>{
    req.flash("successes", {
      message: "Successesfully created a new to do"
    })
    res.redirect("/home");
  })
  .catch(e=>{
    console.log(e)
    req.flash("errors", {
      message: "An error occured creating a new to do"
    })
    res.redirect("/new")
  })

})

app.get("/del/:id", (req, res)=>{
  Todo.updateOne(
    {
    _id: req.params.id
    },
    {
      completed: true
    }

  )
  .then(todo=>{
    req.flash("successes", {
      message: "Marked as complete!"
    })
  })
  .catch(e=>{
    console.log(e);
    req.flash("errors", {
      message: "An error occured"
    })
  })
  res.redirect("/home");
})

//LOGOUT
app.get("/logout", (req, res)=>{
  req.session.userId = undefined;
  res.redirect("/");
})



app.listen(port, () => {
    console.log(`Web serber up on port ${port}`);
});
