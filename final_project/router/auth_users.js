const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"admin","password":"admin"}];

const isValid = (username)=>{ //returns boolean
  return users.filter(user => user.username == username).length > 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.filter(user => user.username === username && user.password === password).length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.user.data;
  const book = books[req.params.isbn] || null;

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  book.reviews[user] = req.body.review;
  return res.status(200).json(book ? book.reviews[user] : {})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.user.data;
  const book = books[req.params.isbn] || null;

  if (!book || !book.reviews[user])  {
    return res.status(404).json({ message: "Book review not found" });
  }

  delete book.reviews[user];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
