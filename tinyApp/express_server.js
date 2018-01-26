var express = require('express');
var cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var app = express();
app.use(cookieSession({
  name: 'session',
  keys: ["secretkey"]
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
require('dotenv').config()
var PORT = process.env.PORT || 8080;
var urlDatabase = {
  "userRandomID": {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "b1xVn2": "http://www.google.ca"
  },
  "user2RandomID": {
    "b2xVn2": "http://www.lighthouselabs.ca"
  }
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

//route to register

app.get('/register', (req, res) => {
  res.render("url_registration", {urls: urlDatabase, userId: req.session.userId});
});
app.post('/register', (req, res) => {
  console.log(req.body);
  var userRandom = generateRandomString();
  var existEmail = Object.keys(users).filter(function (id) {
    return users[id].email === req.body.email;
  });
  if(req.body.email === '' || req.body.password === '') {
    console.log("Email and Password cannot be empty");
    res.status(400);
    res.send("Empty email or password");
  } else if (existEmail.length !== 0) {
    res.status(400);
    res.send("Email already exist");
  } else {
    users[userRandom] = {
    id: userRandom,
    email: req.body.email,
    password: req.body.password
    };
    req.session.userId = userRandom;
    res.render('urls_index', {urls: urlDatabase, userId: userRandom});
  }
});

//route to login
app.post('/urls/login', (req, res) => {
  var userId;
  var existEmail;
  var existPassword;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  for (var user in users) {
    if (users[user].email === req.body.email && bcrypt.compareSync(users[user].password, hashedPassword)) {
      existUserId = users[user].id;
      existEmail = users[user].email;
      existPassword = users[user].password;
    }
  }
  console.log(existPassword, existEmail);
  if(req.body.email === '' || req.body.password === '') {
    console.log("Email and Password cannot be empty");
    res.status(403);
    res.send("Empty email or password");
  } else if (existEmail && existPassword) {
    req.session.userId = existUserId;
    res.render('urls_index', {urls: urlDatabase, userId: existUserId});
  } else {
    res.status(403);
    res.send("Invalid email or password");
  }
});

//route to delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.session.userId][req.params.id];
  res.render('urls_index', {urls: urlDatabase, userId: req.session.userId});      // Respond with 'Ok' (we will replace this)
});


//route to create
app.get('/urls/new', (req, res) => {
  res.render('urls_new', {urls: urlDatabase, userId: req.session.userId});
});
app.post("/urls/:id/new", (req, res) => {
  const shortURL = generateRandomString();
  console.log(req.params, req.body);
  const longURL = req.body.longURL;
  if(urlDatabase[req.params.id] === undefined) {
    urlDatabase[req.params.id] = {
    shortURL:longURL
    }
  } else {
    urlDatabase[req.params.id][shortURL] = longURL;
    // urlDatabase[req.params.id][shortURL] = longURL;
    console.log(urlDatabase);
  }
  res.render('urls_index', {urls: urlDatabase, userId: req.session.userId});
});

//route to update
app.get('/urls/:id/update', (req, res) => {
  res.render("urls_update", {id: req.params.id, userId: req.session.userId });
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.session.userId] = {};
  urlDatabase[req.session.userId][req.params.id] = req.body.longURL;
  console.log(urlDatabase);
  res.render('urls_index', {urls: urlDatabase, userId: req.session.userId});
});

//route to logout
app.post("/urls/logout", (req,res) => {
  // Session.Clear();
  // Session.Abandon();
  // Session.RemoveAll();
  req.session.userId = '';
  // res.clearCookie('userId');
  res.redirect("/register");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

