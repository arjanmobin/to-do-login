const validateUser = (req, res, next) => {
  if(req.session.userId) {
    next();
  } else {
    req.flash('errors', {
        message: "Please log in first"
    });
    res.redirect('/login');
  }
}

module.exports = {validateUser};
