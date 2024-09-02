const express = require('express');
const axios = require('axios'); 
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (isValid(username)) {
        users.push({ username, password });
        res.status(201).json({ message: 'User registered successfully.' });
    } else {
        res.status(400).json({ message: 'Username already exists.' });
    }
});

// Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
    })
    .then((bookList) => {
        res.send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
        res.status(500).json({ message: 'Error retrieving book list', error });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn; // Get ISBN from request parameters
    let book = books[isbn]; // Find the book by ISBN

    if (book) {
        res.json(book); // Send the book details as JSON
    } else {
        res.status(404).send('Book not found'); // Handle case where book is not found
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const result = [];

    // Iterate through the books and find the ones by the given author
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result.push(books[key]);
        }
    }

    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).send('No books found for the given author.');
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  let result = [];

  // Iterate through the books object to find matching titles
  for (const key in books) {
      if (books[key].title.toLowerCase().includes(title)) {
          result.push(books[key]);
      }
  }

  if (result.length > 0) {
      res.json(result);
  } else {
      res.status(404).json({ message: 'No books found with the given title.' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        const reviews = book.reviews;
        if (Object.keys(reviews).length > 0) {
            res.json(reviews);
        } else {
            res.status(404).json({ message: 'No reviews found for the given ISBN.' });
        }
    } else {
        res.status(404).json({ message: 'Book not found with the given ISBN.' });
    }
});

module.exports.general = public_users;
