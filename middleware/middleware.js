const validateUser = (req, res, next) => {
  if(req.session.userId) {
    next();
  } else {
<<<<<<< HEAD
    req.flash('errorMessages', {message: 'Not logged in. Please log in'});
=======
    req.flash('errorMessages', {message: 'Please login'});
>>>>>>> 6ddd19afe966b832baa031a919cd9b7cdd623e96
    res.redirect('/login');
  }
}

module.exports = {validateUser};
