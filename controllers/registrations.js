const User = require('../models/user');

function newRoute(req, res) {
  return res.render('registrations/new');
}

function createRoute(req, res, next) {
  User
    .create(req.body)
    .then(() => res.redirect('/login'))
    .catch((err) => {
      if(err.name === 'ValidationError') {
        req.flash('alert', 'Passwords do not match YO!');
        return res.redirect('/register');
      }
      next();
    });
}

module.exports = {
  new: newRoute,
  create: createRoute
};
