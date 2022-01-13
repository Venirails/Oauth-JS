// index.js
 const session = {
  secret: '389dd3beece490dabc16594e44c27d76b5b867737e08ddf830fcadbce1388cd7',
  cookie: {},
  resave: false,
  saveUninitialized: false
};
/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");


const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

require("dotenv").config();
const authRouter = require("./auth");

/**
 * App Variables
 */


const app = express();
const port = process.env.PORT || "8000";
/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
//var app1 = express();
//app1.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
// Creating custom middleware with Express
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});
app.use("/", authRouter);
/**
 * Passport Configuration
 */

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);
passport.use(strategy);


/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/user", (req, res) => {
  res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
});
/**
 * Server Activation
 */

 app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

/*session*/



