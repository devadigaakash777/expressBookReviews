const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).send("Book not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author === author);

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).send("No books found for the author");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title === title);

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).send("No books found with that title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).send("No reviews found for the given ISBN");
  }
});

//////////////////////async and await//////////////////////

async function getAllBooksAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("Books List (Async/Await):\n", JSON.stringify(response.data, null, 4));
  } catch (err) {
    console.error("Error fetching books:", err.message);
  }
}


async function getBookByISBNAsync(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log("Book (ISBN):\n", JSON.stringify(response.data, null, 4));
  } catch (err) {
    console.error("Error fetching book by ISBN:", err.message);
  }
}


async function getBooksByAuthorAsync(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log("Books by Author:\n", JSON.stringify(response.data, null, 4));
  } catch (err) {
    console.error("Error fetching books by author:", err.message);
  }
}


async function getBooksByTitleAsync(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log("Books by Title:\n", JSON.stringify(response.data, null, 4));
  } catch (err) {
    console.error("Error fetching books by title:", err.message);
  }
}

//getBooksByTitleAsync("Dante Alighieri");
module.exports.general = public_users;
