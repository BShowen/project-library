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

Book.prototype.toggleStatus = function(){
  this.read = !this.read;
}

// Adds a book to the library. 
function addBookToLibrary(book){
  const startingLibrary = library.length;
  library.push(book);
  return library.length > startingLibrary;
}

// Creates a card element and returns it. 
function Card(book){
  // Create the card div.
  const card = document.createElement("div");
  card.className = "card";

  // Create the card header.
  const cardHeader = document.createElement("div");
  cardHeader.className = "card_header";
  const titleDiv = document.createElement("div");
  const titleName = document.createElement("p");
  titleName.textContent = book.title;
  titleDiv.appendChild(titleName)
  cardHeader.appendChild(titleDiv);
  card.appendChild(cardHeader);

  // Create card body.
  const cardBody = createCardBody(book);
  card.appendChild(cardBody);

  // Create the card footer. 
  const cardFooter = document.createElement("div");
  cardFooter.className = "card_footer";

  const toggleReadStatusButton = document.createElement("button");
  toggleReadStatusButton.className = "toggleReadStatus";
  toggleReadStatusButton.innerText = "Toggle read status";
  // Toggle book read status on button click. 
  toggleReadStatusButton.addEventListener("click", ()=>{
    book.toggleStatus();
    updateDOM();
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.innerText = "Delete";
  // Delete the book when clicked.
  deleteButton.addEventListener("click", (e)=>{
    // This is the index in the library array for the book that was clicked. 
    const index = e.target.parentNode.parentNode.dataset.index;
    library[index] = null;
    updateDOM();
  })
  
  cardFooter.appendChild(toggleReadStatusButton);
  cardFooter.appendChild(deleteButton);

  card.appendChild(cardFooter);
  return card;
}

// Create a new HTML book element and returns it. 
// params is an object {string: title, string: author, int: pages, boolean: read}
function createCardBody(book){  
  // Create the left and right containers
  const leftDiv = createLeftDiv(); 
  const rightDiv = createRightDiv(book);

  const card = document.createElement("div");
  card.className = "card_body";
  card.appendChild(leftDiv);
  card.appendChild(rightDiv);

  return card;
}

// Create the right side of the card. This holds the details that the user enters in the form. 
function createRightDiv(book){
  const rightDiv = document.createElement("div");
  rightDiv.className = "right";
  // Create the card author 
  const author = document.createElement("div");
  author.className = "book_information";
  const author_name = document.createElement("p");
  author_name.textContent = book.author;
  author.appendChild(author_name);
  // Create the card pages
  const pages = document.createElement("div");
  pages.className = "book_information";
  const numberOfPages = document.createElement("p");
  numberOfPages.textContent = book.pages;
  pages.appendChild(numberOfPages);
  // Create the card read status. 
  const readStatus = document.createElement("div");
  readStatus.className = "book_information";
  const read = document.createElement("p");
  read.textContent = book.read ? "Yes" : "No" ;
  readStatus.appendChild(read);

  rightDiv.appendChild(author);
  rightDiv.appendChild(pages);
  rightDiv.appendChild(readStatus);

  return rightDiv;
}

// Create the left side of the card. This holds the labels for the card details. 
function createLeftDiv(){
  const leftDiv = document.createElement("div");
  leftDiv.className = "left";

  // Create the author label. 
  const authorDiv = document.createElement("div");
  const authorLabel = document.createElement("p");
  authorLabel.textContent = "Author";
  authorDiv.appendChild(authorLabel);

  // Create the number of pages label. 
  const pagesDiv = document.createElement("div");
  const pagesLabel = document.createElement("p");
  pagesLabel.textContent = "Pages";
  pagesDiv.appendChild(pagesLabel);

  // Create the read status label.
  const readStatusDiv = document.createElement("div");
  const readStatusLabel = document.createElement("p");
  readStatusLabel.textContent = "Book completed";
  readStatusDiv.appendChild(readStatusLabel);

  leftDiv.appendChild(authorDiv);
  leftDiv.appendChild(pagesDiv);
  leftDiv.appendChild(readStatusDiv);

  return leftDiv;
}

// Here, we are adding the books to the DOM. 
function updateDOM(){
  const libraryElement = document.querySelector("#library");
  libraryElement.innerHTML = "";
  library.forEach( (book, index) => {
    if(book){
      const card = new Card(book);
      // Add the index to the card. This is used for identification throughout the lifecycle of the card. 
      card.dataset.index = index;
      libraryElement.appendChild(card);
    }
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

  // MOve focus to the form. 
  document.querySelector("#bookTitle").focus();
}

// Let the user close the modal by hitting "escape";
(function escapeKey(){
  document.addEventListener("keydown", (e)=>{
    const modalWindow = document.querySelector(".modal");
    if(e.code && e.code.toLowerCase() === "escape" && !modalWindow.classList.contains("hidden")){
      closeModal();
    }
  });
})();

// Allow the modal to be closed by clicking anywhere outside the form. 
(function closeModalWithClick(){
  const modal = document.querySelector(".modal");
  modal.addEventListener("click", (e)=>{
    if(e.target.classList.contains("modal")){ 
      closeModal();
    }
  });
})();

// Handle form submission. 
const formSubmitButton = document.querySelector("#formSubmitButton");
formSubmitButton.addEventListener("click", (e) => {
  e.preventDefault();
  if( formValid() ){
    addBookToLibrary( getFormData() );
    document.querySelector("form").reset();
    closeModal();
    updateDOM();
  }else{
    highlightErrors();
  }
});

// Closes the modal. 
function closeModal(){
  const modal = document.querySelector(".modal");
  const form = document.querySelector("form");
  modal.classList.toggle("hidden");
  modal.style.backgroundColor = "rgba(0,0,0,0.00)";  
  resetFormErrors();
  form.reset();
}

// Validates the form. Returns true or false. 
function formValid(){
  const title = document.querySelector("#bookTitle");
  const author = document.querySelector("#bookAuthor");
  const pages = document.querySelector("#bookPages");

  return title.value.trim().length > 0 && author.value.trim().length > 0 && pages.value.trim().length > 0;
}

// Change invalid HTML element borders to red to signify error
function highlightErrors(){
  let formInputs = [
    document.querySelector("#bookTitle"), 
    document.querySelector("#bookAuthor"), 
    document.querySelector("#bookPages")
  ];

  formInputs.forEach((input)=>{
    if(input.value.trim().length <= 0){
      input.style.borderColor = "red";
    }else if(input.style.borderColor == "red"){
      input.style.borderColor = "rgb(0, 0, 0, 15%)";
    }
  });
}

/* 
  Remove form error borders. This function is called when the user fills out the form and its invalid, 
  tries to submit it, the form inputs change from grey to red, then the user closes the form without 
  submitting again. This function returns those red borders back to the original color. Then next time 
  the form is opened it is cleared and ready. 
*/
function resetFormErrors(){
  let formInputs = [
    document.querySelector("#bookTitle"), 
    document.querySelector("#bookAuthor"), 
    document.querySelector("#bookPages")
  ];

  formInputs.forEach((input)=>{
    input.style.borderColor = "rgb(0, 0, 0, 15%)";
  });
}

// Get the user input from the form, return a Book object. 
function getFormData(){
  const title = document.querySelector("#bookTitle");
  const author = document.querySelector("#bookAuthor");
  const pages = document.querySelector("#bookPages");
  const readStatus = document.querySelector("input[name=readStatus]");
  
  return new Book({
    title: title.value, 
    author: author.value, 
    pages: pages.value, 
    read: readStatus.checked,
  });
}

updateDOM();