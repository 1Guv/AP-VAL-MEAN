// require our packages
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const {port,env, dbURI, sessionSecret} = require('./config/environment');
const errorHandler = require('./lib/errorHandler');
const routes = require('./config/routes');
const customResponses = require('./lib/customResponses');
const authentication = require('./lib/authentication');

// cre./lib/at tan express app
const app = express();

// set up our template engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

// set up our static files folder
app.use(express.static(`${__dirname}/public`));

// create a db connection
mongoose.connect(dbURI);

// set up our middleware
if(env !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride((req) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;

    return method;
  }
}));

// set up our sessions
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

// set up flash messages AFTER sessions (requires SESSIONs above to work)
app.use(flash());

// linked to customResponses.js
app.use(customResponses);
app.use(authentication);

// set up our routes - just before our error handler
app.use(routes);

// set up our error handler - should be our LAST middleware
app.use(errorHandler);

app.listen(port, () => console.log(`YO Express is listening to ${port}`));
