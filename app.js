const express = require("express");
const path = require("path");
const bodyPaser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const myVar = {
  domain: "dev-jcgz0gvu.auth0.com",
  clientID: "ugusdukie2E88V3hQWSwDbEIDyxPciDa",
  clientSecret:
    "h5clbeZMf0eNsQA9xKY5RcN6UwYxKbFvUFk44HfJioOQz5uP61OBQHPRNYYOotKw",
  callbackURL: "http://localhost:3000/callback",
};

const strategy = new Auth0Strategy(
  {
    domain: "dev-jcgz0gvu.auth0.com",
    clientID: "ugusdukie2E88V3hQWSwDbEIDyxPciDa",
    clientSecret:
      "h5clbeZMf0eNsQA9xKY5RcN6UwYxKbFvUFk44HfJioOQz5uP61OBQHPRNYYOotKw",
    callbackURL: "http://localhost:3000/callback",
  },
  function (accessToken, refreshToken, extraParam, profile, done) {
    return done(null, profile);
  }
);

passport.use(strategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "your_secret_key",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.leggedIn = false;
  if (req.session.passport && typeof req.session.passport.user != "undefined") {
    res.locals.loggedIn = true;
  }
  next();
});
app.get("/", function (req, res, next) {
  res.render("index");
});
app.get(
  "/login",
  passport.authenticate("auth0", {
    clientID: myVar.clientID,
    domain: myVar.domain,
    redirectUri: myVar.callnbackURL,
    responseType: "code",
    audience: "http://dev-jcgz0gvu.auth0.com/userinfo",
    scope: "openid profile",
  }),
  function (req, res) {
    res.redirect("/");
  }
);
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("./");
});
app.get(
  "/callback",
  passport.authenticate("auth0", { failureRedirect: "failure" }),
  function (req, res) {
    res.redirect("/user");
  }
);
app.get("/user", function (req, res, next) {
  res.render("user", { user: req.user });
});
app.get("/failure", function (req, res, next) {
  res.render("failure");
});

app.listen(3000, function () {
  console.log("your server is running on port 3000");
});
