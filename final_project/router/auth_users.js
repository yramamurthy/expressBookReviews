const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 if (username && username.length>3)
  return true;

 return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  console.log(users);
  const user=users.find(x=>x.username===username&&x.password===password);
  if (user)
    return true;
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const payload = req.body;
  
  if (authenticatedUser(payload.username, payload.password))
  {
    const token = jwt.sign({user: payload.username}, 'access', {expiresIn: '1h'})
    return res.send(token) 
  }
  return res.status(401).json({message: "Unauthorized user credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.user;
  const isbn = req.params.isbn;
  const review = req.query.review;
  if (isbn in books){
    const book = books[isbn]
    book.reviews[user]=review
    return res.status(200).json({message: `Reviews updated for the book with isbn ${isbn}`});
  }
  else
      return res.status(404).send('Book not found')
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.user;
  const isbn = req.params.isbn;
  if (isbn in books){
    const book = books[isbn]
    delete book.reviews[user] 
    return res.status(200).json({message: `Reviews by ${user} deleted for the book with isbn ${isbn}`});
  }
  else
      return res.status(404).send('Book not found')
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
