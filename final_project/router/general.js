const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const payload = req.body;

  if (isValid(payload.username)){
    if (!payload.password)
      res.status(400).send('provide password')
  
    const user = users.findIndex(x=>x.username!==payload.username);
    if (user>0)
      users[user]=payload;
    else
      users.push(payload);
  
    res.status(201).send(payload)
    console.log(users)
  }
  else
    res.status(400).send('provide valid username')

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(books);
});

public_users.get('/isbn/:isbn', (req, res)=>{
  const isbn = req.params.isbn;
  if (isbn in books){
      res.send(books[isbn])
  }
  else
      res.status(404).send('Book not found')
})

public_users.get('/author/:author', (req, res)=>{
  const author = req.params.author;
  for(let key in books){
      if (books[key].author===author)
          return res.send(books[key])
  }
  res.status(404).send('Book not found')
})

public_users.get('/title/:title', (req, res)=>{
  const title = req.params.title;
  for(let key in books){
      if (books[key].title===title)
          return res.send(books[key])
  }
  res.status(404).send('Book not found')
})

public_users.get('/review/:isbn', (req, res)=>{
  const isbn = req.params.isbn;
  if (isbn in books){
      res.send(books[isbn].reviews)
  }
  else
      res.status(404).send('Book not found')
})

module.exports.general = public_users;
