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

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn; // Get ISBN from request parameters
    let book = books[isbn]; // Find the book by ISBN
    new Promise((resolve, reject) => {
        resolve(book);
    })
    .then((bookList) => {
        res.send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
        res.status(500).json({ message: 'Error retrieving book list', error });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();

    new Promise((resolve, reject) => {
        // Simulate a delay or async operation (e.g., database query) if needed
        setTimeout(() => {
            const result = [];

            // Iterate through the books and find the ones by the given author
            for (let key in books) {
                if (books[key].author.toLowerCase() === author) {
                    result.push(books[key]);
                }
            }

            if (result.length > 0) {
                resolve(result);
            } else {
                reject(new Error('No books found for the given author.'));
            }
        }, 100); // Simulate a small delay
    })
    .then(booksByAuthor => {
        res.json(booksByAuthor);
    })
    .catch(error => {
        console.error('Error fetching books by author:', error); // Logs detailed error info
        res.status(404).json({ message: 'Error fetching books by author', error: error.message });
    });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    // Create a new Promise to handle the async operation
    new Promise((resolve, reject) => {
        // Simulate async behavior with setTimeout
        setTimeout(() => {
            const result = [];

            // Iterate through the books and find matching titles
            for (const key in books) {
                if (books[key].title.toLowerCase().includes(title)) {
                    result.push(books[key]);
                }
            }

            if (result.length > 0) {
                resolve(result);
            } else {
                reject(new Error('No books found with the given title.'));
            }
        }, 100); // Simulate delay
    })
    .then(booksByTitle => {
        res.json(booksByTitle);
    })
    .catch(error => {
        console.error('Error fetching books by title:', error); // Log detailed error info
        res.status(404).json({ message: 'Error fetching books by title', error: error.message });
    });
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
