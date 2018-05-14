const validateUser = (req, res, next) => {
  if(req.session.userId) {
    next();
  } else {
    req.flash('errorMessages', {message: 'Not logged in. Please log in'});
    res.redirect('/login');
  }
}

module.exports = {validateUser};
