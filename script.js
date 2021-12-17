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
let testBook_3 = new Book({title: "Book 3", author: "Book 2 Author", pages: 1002, read: false});
let testBook_4 = new Book({title: "Book 4", author: "Book 2 Author", pages: 1002, read: false});
let testBook_5 = new Book({title: "Book 5", author: "Book 2 Author", pages: 1002, read: false});
let testBook_6 = new Book({title: "Book 6", author: "Book 2 Author", pages: 1002, read: false});
let testBook_7 = new Book({title: "Book 7", author: "Book 2 Author", pages: 1002, read: false});
let testBook_8 = new Book({title: "Book 8", author: "Book 2 Author", pages: 1002, read: false});
let testBook_9 = new Book({title: "Book 9", author: "Book 2 Author", pages: 1002, read: false});
let testBook_10 = new Book({title: "Book 10", author: "Book 2 Author", pages: 1002, read: false});
let testBook_11 = new Book({title: "Book 11", author: "Book 2 Author", pages: 1002, read: false});
let testBook_12 = new Book({title: "Book 12", author: "Book 2 Author", pages: 1002, read: false});
addBookToLibrary(testBook_1);
addBookToLibrary(testBook_2);
addBookToLibrary(testBook_3);
addBookToLibrary(testBook_4);
addBookToLibrary(testBook_5);
addBookToLibrary(testBook_6);
addBookToLibrary(testBook_7);
addBookToLibrary(testBook_8);
addBookToLibrary(testBook_9);
addBookToLibrary(testBook_10);
addBookToLibrary(testBook_11);
addBookToLibrary(testBook_12);

// Here, we are adding the books to the DOM. 
const libraryElement = document.querySelector("#library");
library.forEach( book => {
  const card = new Card();
  const currentBook = new BookElement(book);
  card.appendChild(currentBook);
  libraryElement.appendChild(card);
});



// Nav button
const navButton = document.querySelector("#nav > button");
navButton.addEventListener("click", ()=>{
  showModalForm();
});
navButton.click();

// Show the modal form. 
function showModalForm(){
  // Prevent scrolling while modal is open. 
  const html = document.querySelector("html");
  html.classList.toggle("fixed");

  // Show the model. 
  const modalWindow = document.querySelector(".modal");
  modalWindow.classList.toggle("hidden");
  // Dim the screen slowly. 
  setTimeout(()=>{
    modalWindow.style.backgroundColor = "rgba(0,0,0,0.50)";
  }, 1);

  // Remove focus from the button. Otherwise if the user presses the space bar with focus on the button it will cause a bug with the way the modal behaves afterwards.
  navButton.blur(); 
}

// Let the user close the modal by hitting "escape";
(function escapeKey(){
  document.addEventListener("keydown", (e)=>{

    const modalWindow = document.querySelector(".modal");
    
    if(e.code.toLowerCase() === "escape" && !modalWindow.classList.contains("hidden")){
      // Allow the body of the page to scroll again. 
      const html = document.querySelector("html");
      html.classList.toggle("fixed");
  
      // Hide the modal. 
      modalWindow.classList.toggle("hidden");
      modalWindow.style.backgroundColor = "rgba(0,0,0,0.00)";
    }
  });
})();

// Allow the modal to be closed by clicking anywhere outside the form. 
(function closeModalWithClick(){
  const modal = document.querySelector(".modal");
  modal.addEventListener("click", (e)=>{
    if(e.target.classList.contains("modal")){ 
      const modalWindow = document.querySelector(".modal");
      // Allow the body of the page to scroll again. 
      const html = document.querySelector("html");
      html.classList.toggle("fixed");
  
      // Hide the modal. 
      modalWindow.classList.toggle("hidden");
      modalWindow.style.backgroundColor = "rgba(0,0,0,0.00)";
    }
  });
})();

// Handle form submission. 
const formSubmitButton = document.querySelector("#formSubmitButton");
formSubmitButton.addEventListener("click", (e) => {
  e.preventDefault();
});