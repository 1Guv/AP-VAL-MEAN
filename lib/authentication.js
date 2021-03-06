const User = require('../models/user');

function authentication(req, res, next) {
  // check to see if the user is logged in
  // if not thn exit this peice of middlleware
  if(!req.session.isAuthenticated) return next();

  // find the user based on the userId in the session
  User
    .findById(req.session.userId)
    .then((user) => {
      if(!user) {
        // if the user cannot be found log out the user
        return req.session.regenerate(() => res.unauthorized());
      }

      // set the userId back on the session
      req.session.userId = user.id;

      // set the whole user object to the request object
      // so we can use the users details in our controllers
      req.user = user;

      // set the whole user object to res.locals so we can use it in the views
      res.locals.user = user;
      // set an isAuthenticated boolean so we can show and hide buttons and links
      res.locals.isAuthenticated = true;

      // ok we are done move on to the next peice of middleware
      next();
    })
  .catch(next); // handle any errors with our global error catcher
}

module.exports = authentication;
