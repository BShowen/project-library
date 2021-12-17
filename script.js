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

// Here, we are adding the books to the DOM. 
function updateDOM(){
  const libraryElement = document.querySelector("#library");
  libraryElement.innerHTML = "";
  library.forEach( (book, index) => {
    const card = new Card();
    // Add the index to the card. This is used for identification throughout the lifecycle of the card. 
    card.dataset.index = index;
    const currentBook = new BookElement(book);
    card.appendChild(currentBook);
    libraryElement.appendChild(card);
  });
}

// Nav button
const navButton = document.querySelector("#nav > button");
navButton.addEventListener("click", ()=>{
  showModalForm();
});

// Show the modal form. 
function showModalForm(){
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
    if(e.code && e.code.toLowerCase() === "escape" && !modalWindow.classList.contains("hidden")){
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
      // Hide the modal. 
      modal.classList.toggle("hidden");
      modal.style.backgroundColor = "rgba(0,0,0,0.00)";
    }
  });
})();

// Handle form submission. 
const formSubmitButton = document.querySelector("#formSubmitButton");
formSubmitButton.addEventListener("click", (e) => {
  e.preventDefault();
  const formData = getFormData();
  if( formData.valid ){
    addBookToLibrary(formData.book);
    // Hide the modal. 
    const modal = document.querySelector(".modal");
    modal.classList.toggle("hidden");
    modal.style.backgroundColor = "rgba(0,0,0,0.00)";  
    updateDOM();
  }else{
    console.log("INVALID");
  }
});

function getFormData(){
  const formData = {valid: false};
  const title = document.querySelector("#bookTitle");
  const author = document.querySelector("#bookAuthor");
  const pages = document.querySelector("#bookPages");
  const readStatus = document.querySelector("input[name=readStatus]:checked");
  
  formData.valid = !!title.value && !!author.value && !!pages.value && !!readStatus.value;
  
  if(formData.valid){
    formData.book = new Book({
      title: title.value, 
      author: author.value, 
      pages: pages.value, 
      read: readStatus.value,
    });
  }

  return formData;
}

updateDOM();