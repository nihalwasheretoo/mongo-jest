const mongoose = require("mongoose");

const collection = "Book";

const BookSchema = new mongoose.Schema(
  {
    author: {
      type: String
    },
    price: {
      type: Number
    },
    genre: {
      type: String
    }
  },
  { timestamps: true }
);

const Book = mongoose.model(collection, BookSchema);
module.exports = Book;
