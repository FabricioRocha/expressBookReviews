const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let nameused = users.filter((user) => user.username == username);
  return (nameused.length == 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  return (validusers.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: username
      }, 'access', { expiresIn: 60 * 60 });
    
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const uname = req.user.data;
  const text = req.body.review;
  
  // Find the book
  let keys = Object.keys(books);
  
  for (let i = keys[0]; i <= keys[keys.length - 1]; i++) {
    if (Object.hasOwn(books[i], 'isbn13') && books[i].isbn13 == isbn) {
      books[i].reviews[uname] = text;
      res.send("Review saved");
      break;
    }
  }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const uname = req.user.data;
  const text = req.body.review;
  
  // Find the book
  let keys = Object.keys(books);
  
  for (let i = keys[0]; i <= keys[keys.length - 1]; i++) {
    if (Object.hasOwn(books[i], 'isbn13') && books[i].isbn13 == isbn) {
      delete books[i].reviews[uname];
      res.send("Review removed");
      break;
    }
  }
  
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
