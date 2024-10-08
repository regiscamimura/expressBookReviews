const express = require('express');
const axios = require('axios').default;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let books = [];


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist

        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const response = await axios.get('https://raw.githubusercontent.com/regiscamimura/expressBookReviews/refs/heads/main/final_project/router/booksdb.json');
  books = response.data;
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const response = await axios.get('https://raw.githubusercontent.com/regiscamimura/expressBookReviews/refs/heads/main/final_project/router/booksdb.json');
  books = response.data;
  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const response = await axios.get('https://raw.githubusercontent.com/regiscamimura/expressBookReviews/refs/heads/main/final_project/router/booksdb.json');
  books = response.data;
  const author_books = Object.values(books).filter((book) => book.author === author);

  return res.status(200).json(author_books);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

  const response = await axios.get('https://raw.githubusercontent.com/regiscamimura/expressBookReviews/refs/heads/main/final_project/router/booksdb.json');
  books = response.data;
  
  const title = req.params.title.replace(/\-/g, ' ');
  const books_by_title = Object.values(books).filter((book) => book.title === title);
  return res.status(200).json(books_by_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  const book = books[req.params.isbn] || {};
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
