const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const JWT_SECRET = 'fingerprint_customer';
// Check if the username is valid
const isValid = (username) => {
    return username && username.trim().length > 0 && !users.some(user => user.username === username);
}

// Authenticate user
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // If no token is provided

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid
        req.user = user;
        next();
    });
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password.' });
    }
});

// Add or modify a book review
regd_users.put("/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: 'Review is required.' });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found.' });
    }

    // Add or modify the review
    if (!books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review;
        return res.status(201).json({ message: 'Review added.' });
    } else {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: 'Review updated.' });
    }
});

// Delete a book review
regd_users.delete("/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found.' });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: 'Review deleted.' });
    } else {
        return res.status(404).json({ message: 'Review not found.' });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
