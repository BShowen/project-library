// Store all of the books in this array. 
let library = [];

// Book constructor. 
// params is an object that has string: title, string: author, int: pages and boolean: read
function Book(params){
  this.title = params.title;
  this.author = params.author;
  this.pages = params.pages;
  this.read = params.read;
}

// Adds a book to the library. 
function addBookToLibrary(book){
  const startingLibrary = library.length;
  library.push(book);
  return library.length > startingLibrary;
}

// Creates a card element and returns it. 
function Card(){
  const card = document.createElement("div");
  card.className = "card";
  return card;
}

// Create a new book element and returns it. 
// params is an object {string: title, string: author, int: pages, boolean: read}
function BookElement(params){
  const div = document.createElement("div");
  div.className = "book";

  const title = document.createElement("div");
  title.className = "book_information title";
  const title_name = document.createElement("p");
  title_name.textContent = params.title;
  title.appendChild(title_name);

  const author = document.createElement("div");
  author.className = "book_information author";
  const author_name = document.createElement("p");
  author_name.textContent = params.author;
  author.appendChild(author_name);

  const pages = document.createElement("div");
  pages.className = "book_information pages";
  const numberOfPages = document.createElement("p");
  numberOfPages.textContent = params.pages;
  pages.appendChild(numberOfPages);

  const readStatus = document.createElement("div");
  readStatus.className = "book_information read_status";
  const read = document.createElement("p");
  read.textContent = params.read;
  readStatus.appendChild(read);

  div.appendChild(title);
  div.appendChild(author);
  div.appendChild(pages);
  div.appendChild(readStatus);

  return div;
}

// This is test code. Delete when finished with it. 
let testBook_1 = new Book({title: "Book 1", author: "Book 1 Author", pages: 300, read: true});
let testBook_2 = new Book({title: "Book 2", author: "Book 2 Author", pages: 1002, read: false});
addBookToLibrary(testBook_1);
addBookToLibrary(testBook_2);

// Here, we are adding the books to the DOM. 
const libraryElement = document.querySelector("#library");
library.forEach( book => {
  const card = new Card();
  const currentBook = new BookElement(book);
  card.appendChild(currentBook);
  libraryElement.appendChild(card);
});
