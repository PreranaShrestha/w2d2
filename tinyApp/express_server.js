var express = require('express');
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
require('dotenv').config()
var PORT = process.env.PORT || 8080;
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  res.render("url_registration", {userId: req.cookies["userId"]});
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
    res.cookie('userId', userRandom);
    res.render('urls_index', {urls: urlDatabase, userId: userRandom});
  }
});

//route to login
app.post('/urls/login', (req, res) => {
  var userId;
  var existEmail;
  var existPassword;
  for (var user in users) {
    if (users[user].email === req.body.email && users[user].password === req.body.password) {
      existUserId = users[user].id;
      existEmail = users[user].email;
      existPassword = users[user].password;
    }
  }
  console.log(existPassword, existEmail);
  if(req.body.email === '' || req.body.password === '') {
    console.log("Email and Password cannot be empty");
    res.status(400);
    res.send("Empty email or password");
  } else if (existEmail && existPassword) {
    res.cookie('userId', existUserId);
    res.render('urls_index', {urls: urlDatabase, userId: existUserId});
  } else {
    res.status(400);
    res.send("Invalid email or password");
  }
});

//route to delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  console.log(urlDatabase);
  res.render('urls_index', {urls: urlDatabase, userId: req.cookies["userId"]});      // Respond with 'Ok' (we will replace this)
});
//route to create
app.get('/urls/new', (req, res) => {
  res.render('urls_new', {userId: req.cookies["userId"]});
});
app.post("/urls/new", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.render('urls_index', {urls: urlDatabase, userId: req.cookies["userId"]});
});

//route to update

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.render('urls_index', {urls: urlDatabase, userId: req.cookies["userId"]});
});
app.get('/urls/:id/update', (req, res) => {
  res.render("urls_update", {id: req.params.id, userId: req.cookies["userId"] });
});

//route to logout
app.post("/urls/logout", (req,res) => {
  res.clearCookie('userId');
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

