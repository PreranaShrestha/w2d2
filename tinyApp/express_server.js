var express = require('express');
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
require('dotenv').config()
var PORT = process.env.PORT || 8080;
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get('/', (req, res) => {
  res.end("Hello!");
});
app.get('/about', (req, res) => {
  res.end("About us!");
});
app.get('/urls/:id/update', (req, res) => {
  res.render("urls_update", {id: req.params.id});
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});
app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls/" + shortURL);         // Respond with 'Ok' (we will replace this)
});
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
  urls: urlDatabase};
  res.render("url_show", templateVars);
});
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  console.log(urlDatabase);

  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});
app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
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
