const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  // Example user for testing
  { username: 'admin', password: 'password123' }
];

const isValid = (username) => {
  // Check if the username exists in the users array
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  // Check if the username and password match any registered user
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Task 6: Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }

  // Check if the username already exists
  const userExists = users.find(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // If the username doesn't exist, add the new user
  const newUser = { username, password };
  users.push(newUser); // Add the new user to the users array

  return res.status(201).json({ message: "User registered successfully." });
});

  // Check if the user exists and the password matches
  if (authenticatedUser(username, password)) {
    // Generate a JWT token and save it to the session
    const accessToken = jwt.sign({ username }, 'your-secret-key');
    return res.status(200).json({ message: "Login successful", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Middleware to authenticate the user based on JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('authorization')?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(403).json({ message: "Token is required for authentication" });
  }

  // Verify the JWT token
  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user; // Attach user info to the request object
    next();
  });
};

// Add or modify a book review - Task 8
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.user.username; // Get the username from the JWT

  // Validate review input
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // If the book exists, add or modify the review for the user
  if (books[isbn]) {
    // If the user has already posted a review for this book, modify it
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/modified successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review - Task 9
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  // Check if the book exists
  if (books[isbn]) {
    // Check if the user has posted a review for this book
    if (books[isbn].reviews[username]) {
      // Delete the user's review
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
