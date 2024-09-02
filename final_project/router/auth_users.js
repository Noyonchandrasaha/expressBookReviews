const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const JWT_SECRET = 'fingerprint_customer';
const isValid = (username)=>{ //returns boolean
// Check if username is non-empty and unique
    return username && username.trim().length > 0 && !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Check for missing username or password
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT token
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password.' });
    }
});

// Add a book review (placeholder for future implementation)
regd_users.put("/auth/review/:isbn", (req, res) => {
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
