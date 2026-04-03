const express = require('express');
let books = require("./booksdb.js").books;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
      get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const get_book_isbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(res.status(200).json(books[isbn]));
        } else {
            reject(res.status(404).json({message: "Book not found"}));
        }
    });
    get_book_isbn.
        then(() => console.log("Promise for Task 11 resolved")).
        catch(() => console.log("ISBN not found"));
});
  
// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const get_books_author = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author === author);
        if (filteredBooks.length > 0) {
            resolve(res.status(200).json(filteredBooks));
        } else {
            reject(res.status(404).json({message: "No books found by this author"}));
        }
    });
    get_books_author.
        then(() => console.log("Promise for Task 12 resolved")).
        catch(() => console.log("Author not found"));
});

// Task 13: Get book details based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const get_books_title = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
        if (filteredBooks.length > 0) {
            resolve(res.status(200).json(filteredBooks));
        } else {
            reject(res.status(404).json({message: "No books found with this title"}));
        }
    });
    get_books_title.
        then(() => console.log("Promise for Task 13 resolved")).
        catch(() => console.log("Title not found"));
});

// Get book review based on ISBN (Standard implementation)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    } else {
      return res.status(404).json({ message: `No reviews found for ISBN ${isbn}` });
    }
});

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "Customer successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user (missing credentials)."});
});

module.exports.general = public_users;

