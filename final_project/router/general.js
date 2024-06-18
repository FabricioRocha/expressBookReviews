const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const uname = req.body.username;
  const upwd = req.body.password;
  if (uname && upwd) {
    if (isValid(uname)) {
      users.push({username: uname, password: upwd});
      res.status(200).json({message: "User created"});
    } else {
      res.status(400).json({message: `User $uname already registered`});
    }

  } else {
    res.status(400).json({message: "Missing username and/or password"});
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let keys = Object.keys(books);
  let found = [];
  
  for (let i = keys[0]; i <= keys[keys.length - 1]; i++) {
    if (Object.hasOwn(books[i], 'isbn13') && books[i].isbn13 == isbn) found.push(books[i]);
  }
  
  return res.status(200).json(found);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let keys = Object.keys(books);
  let found = [];
  
  for (let i = keys[0]; i <= keys[keys.length - 1]; i++) {
    if (books[i].author.includes(author)) found.push(books[i]);
  }
  
  return res.status(200).json(found);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let keys = Object.keys(books);
  let found = [];
  
  for (let i = keys[0]; i <= keys[keys.length - 1]; i++) {
    if (books[i].title.includes(title)) found.push(books[i]);
  }
  
  return res.status(200).json(found);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let keys = Object.keys(books);
  let found = [];
  
  for (let i = keys[0]; i <= keys[keys.length - 1]; i++) {
    if (books[i].isbn13 == isbn) res.send(books[i].reviews);
  }
  
});

module.exports.general = public_users;
