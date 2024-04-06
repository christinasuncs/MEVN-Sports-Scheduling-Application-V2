const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// authentication
const session = require("express-session");
const passport = require("passport");
require('./passport');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const generateSalt = require('./saltGenerator');

const app = express();
const PORT = 3000; // || process.env.PORT

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: `${generateSalt()}`,
  resave: false,
  saveUninitialized: false
}));

// Mount authentication routes
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);

module.exports.isAuthenticated = (req, res, next) => {
  console.log(req.isAuthenticated())
    // Passport adds 'req.user' property if user is authenticated
    if (req.isAuthenticated()) {
      // User is authenticated, proceed to the next middleware
      console.log("checked")
      return next();
    }
    // User is not authenticated, redirect to login page or send error response
    res.redirect('/login'); // Redirect to login page
  };
  
  // Middleware function to check if user has specific role/permission
module.exports.hasPermission = (requiredRole) => {
    return (req, res, next) => {
      console.log(req.user)
      // Check if user has the required role/permission
      if (req.user && req.user.role === requiredRole) {
        // User has the required role/permission, proceed to the next middleware
        return next();
      }
      // User does not have the required role/permission, send error response
      res.status(403).send('Forbidden'); // Send 403 Forbidden status
    };
  };

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the application!');
});

app.get('/login', (req, res) => {
  res.send('Login');
});

// Example route that requires authentication and specific role
app.get('/admin', module.exports.isAuthenticated, module.exports.hasPermission("admin"), (req, res) => {
  // Route handler for admin route
  res.send('Logged in');
});

require('./db');

const campus_routes = require("./routes/campus.js");
const team_routes = require("./routes/team.js");
const event_routes = require("./routes/event.js");
const league_routes = require("./routes/league.js");
const email_routes = require("./routes/email.js");
const user_routes = require("./routes/user.js");
const map_routes = require("./routes/map.js");

// campus routes
app.use("/api/campus", campus_routes);
// team routes
app.use("/api/team", team_routes);
// event routes
app.use("/api/event", event_routes);
// league routes
app.use("/api/league", league_routes);
// Email routes
app.use("/api/email", email_routes)
// User routes
app.use("/api/user", user_routes);
// Map routes
app.use("/api/map", map_routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});