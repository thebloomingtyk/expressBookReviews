const express = require('express');
const axios = require('axios'); // If you were to fetch data from an external API
let books = require("./booksdb.js");

let public_users = express.Router();


// Task 10

public_users.get('/', async (req, res) => {
  try {
    const bookList = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });

    res.status(200).json({ books: bookList });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});

// Task 11

public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    const bookDetails = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });

    res.status(200).json({ book: bookDetails });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details based on Author using async/await
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;

  try {
    const booksByAuthor = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
        if (filteredBooks.length > 0) {
          resolve(filteredBooks); // Simulate async fetch
        } else {
          reject(new Error("No books found for this author"));
        }
      }, 1000);
    });

    res.status(200).json({ books: booksByAuthor });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Task 13: Get book details based on Title
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const booksByTitle = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
        if (filteredBooks.length > 0) {
          resolve(filteredBooks); // Simulate async fetch
        } else {
          reject(new Error("No books found with this title"));
        }
      }, 1000);
    });

    res.status(200).json({ books: booksByTitle });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    const book = books[isbn];  // Retrieve the book by ISBN

    if (book) {
      if (Object.keys(book.reviews).length > 0) {
        // If the book has reviews, return them
        res.status(200).json({ reviews: book.reviews });
      } else {
        // If no reviews exist for the book
        res.status(404).json({ message: "No reviews found for this book." });
      }
    } else {
      // If the book does not exist in the database
      res.status(404).json({ message: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
});

module.exports.general = public_users;
