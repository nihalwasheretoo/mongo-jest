const mongoose = require("mongoose");

const BookModel = require("./models/Book");
const { books: bookMocks } = require("./mocks");

describe("INTEGRATION TEST FOR MONGO", () => {
  const databaseName = "test-mongo-jest";

  beforeAll(async () => {
    const url = `mongodb://localhost/${databaseName}`;
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    await BookModel.insertMany(bookMocks);
  });

  afterAll(async () => {
    await BookModel.deleteMany({});
    await mongoose.connection.close();
  });

  const waitForSeconds = ms => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("Success");
      }, ms);
    });
  };

  it("Should fetch all records from book collection", async () => {
    const books = await BookModel.find({});
    expect(books.length).toEqual(5);
  });

  it("Should fetch a single record from book collection", async () => {
    const author = "Author 3";
    const book = await BookModel.findOne({ author });

    // author: 'Author 3',
    // price: 200,
    // genre: 'Sports',

    expect(book.author).toEqual(author);
    expect(book.price).toEqual(200);
    expect(book.genre).toEqual("Sports");
  });

  it("Should create a record in book collection", async () => {
    const book = { author: "Author 6", price: 900, genre: "Health" };
    new BookModel(book).save();

    await waitForSeconds(100);

    const recentlyCreatedBook = await BookModel.findOne({
      author: book.author
    });

    // author: 'Author 6',
    // price: 900,
    // genre: 'Health',

    expect(recentlyCreatedBook.author).toEqual(book.author);
    expect(recentlyCreatedBook.price).toEqual(book.price);
    expect(recentlyCreatedBook.genre).toEqual(book.genre);
  });

  it("Should update a record in book collection", async () => {
    const author = "Author 6";
    await BookModel.updateOne({ author: author }, { $set: { price: 1000 } });

    await waitForSeconds(100);

    const recentlyUpdatedBook = await BookModel.findOne({
      author
    });

    // author: 'Author 6',
    // price: 1000,
    // genre: 'Health',

    expect(recentlyUpdatedBook.author).toEqual(author);
    expect(recentlyUpdatedBook.price).toEqual(1000);
    expect(recentlyUpdatedBook.genre).toEqual("Health");
  });

  it("Should delete a record in book collection", async () => {
    const author = "Author 6";
    await BookModel.deleteOne({ author: author });

    await waitForSeconds(100);

    const recentlyDeletedBook = await BookModel.findOne({
      author
    });

    expect(recentlyDeletedBook).toBeNull();
  });
});
