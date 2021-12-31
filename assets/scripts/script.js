const emitter = (function (){
  const events = {}

  const on = function(eventName, callBack){
    events[eventName] = events[eventName] || [];
    events[eventName].push(callBack);
  }

  // options are used to bind the callers "this" to the callback function. 
  const emit = function(eventName, data, options={}){
    if(events[eventName]){
      events[eventName].forEach( function(callBack){
        if(!!options['this']){
          console.log("binding this");
          callBack.call(options['this'], data);
        }else{
          callBack(data);
        }
      }); 
    }
  }

  const off = function(eventName, callBack){
    if(events[eventName] && events[eventName].includes(callBack)){
      const eventsList = events[eventName];
      const index = events[eventName].indexOf(callBack);
      eventsList.splice(index, 1);
      // Remove the eventName list if it's now empty. 
      if(eventList.length == 0){
        delete eventList[eventName];
      }
    }
  } 

  return { on, off, emit }
})();


// Book class.
class Book{
  saveStatus = true;
  constructor({title, author, pages, read}){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  toggleStatus(){
    this.read = !this.read;
    emitter.emit("updatedABook");
    emitter.emit("toggleStatus");
  }
}

// Creates a card element and returns it. 
class Card{
  #index;
  #card;
  #cardHeader;
  #cardBody;
  #toggleButton;
  #deleteButton;
  #cardFooter;
  constructor(book, index){

    // Create the card div.
    this.#card = document.createElement("div");
    this.#card.className = "card";

    this.#cardHeader = new CardHeader({title: book.title}).render();
    this.#cardBody = new CardBody(book).render();
    this.#setFooter();

    this.#toggleButton = new Button({
      className: "toggleReadStatus", 
      innerText: "Toggle read status", 
      callBack: () => { emitter.emit("toggle", null, {this: book}) },
      // I dont use this code because now Card is more coupled with Book relative to the line of code above this comment. 
      // callBack: ()=> {
      //   book.toggleStatus();
      //   console.log("clicked");
      //   console.log(book);
      // },
    }).render();

    this.#deleteButton = new Button({
      className: "delete", 
      innerText: "Delete", 
      callBack: function(e){
        e.preventDefault();
        emitter.emit("deleteBook", index, {this: book});
      },
    }).render();
  }

  // Create the card setFooter. 
  #setFooter(){
    this.#cardFooter = document.createElement("div");
    this.#cardFooter.className = "card_footer";
  }

  render(){
    this.#cardFooter.appendChild(this.#toggleButton);
    this.#cardFooter.appendChild(this.#deleteButton);
    this.#card.appendChild(this.#cardHeader);
    this.#card.appendChild(this.#cardBody);
    this.#card.append(this.#cardFooter);
    return this.#card;
  }
}

// This function handles the click event when user clicks on the "Toggle read status" button.
// I use an event emitter and this function listens for a specific event. 
// When that event happens, the context of this function is set to the context of the button that was clicked, which is a Book object. 
// I then call the appropriate method on the Book object to toggle the status change. 
(function(){
  // Context is passed in from the caller. It is the "this" from the calling object. 
  const toggleBookStatus = function(){
    this.toggleStatus();
  }
  emitter.on("toggle", toggleBookStatus);
})();

// This function handles the click event when user clicks on the "Delete" button.
// I use an event emitter and this function listens for a specific event. 
// When that event happens, the context of this function is set to the context of the button that was clicked, which is a Book object. 
// I then call the appropriate method on the Book object to toggle the saveStatus (which is used to delete and un-delete books). 
(function(){
  const deleteBook = function(index){
    this.saveStatus = !this.saveStatus;
    console.log(this);
    emitter.emit("deletedABook", index);
  }
  emitter.on("deleteBook", deleteBook);
})();

class Button{
  #button;
  constructor({ className, innerText, callBack }){
    this.#button = document.createElement("button");
    this.#button.className = className;
    this.#button.innerText = innerText;
    this.#button.addEventListener("click", callBack);
  }

  render(){
    return this.#button;
  }
}

// Create the card header.
class CardHeader{
  #div;
  #titleDiv;
  #titleName;
  constructor({title}){
    this.#div = document.createElement("div");
    this.#div.className = "card_header";
    
    this.#titleDiv = document.createElement("div");
    this.#titleName = document.createElement("p");
    this.#titleName.textContent = title || "";
    
    this.#titleDiv.appendChild(this.#titleName)
    this.#div.appendChild(this.#titleDiv);
  }

  render(){
    return this.#div;
  }
}

// params is an object {string: title, string: author, int: pages, boolean: read}
class CardBody{  
  #leftSide;
  #rightSide;
  #cardBody;
  constructor(book){
    this.#cardBody = document.createElement("div");
    this.#cardBody.className = "card_body";
    // Create the left and right containers
    this.#leftSide = this.createLeftDiv(); 
    this.#rightSide = this.createRightDiv(book);
  }

  // Create the left side of the card. This holds the labels for the card details. 
  createLeftDiv(){
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

  // Create the right side of the card. This holds the details that the user enters in the form. 
  createRightDiv(book){
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

  render(){
    this.#cardBody.appendChild(this.#leftSide);
    this.#cardBody.appendChild(this.#rightSide);
    return this.#cardBody;
  }
}

// Here, we handle the state of the DOM.
const app = (function(){
  const updateDOM = function(){
    const libraryElement = document.querySelector("#library");
    libraryElement.innerHTML = "";
    DB.getBooks().forEach( (book, index) => {
      if(book.saveStatus){
        const card = new Card(book, index);
        libraryElement.appendChild(card.render());
      }
    });
  };

  emitter.on("newBook", updateDOM);
  emitter.on("toggleStatus", updateDOM);
  emitter.on("updateState", updateDOM);

  return {start: updateDOM }
})();

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
    DB.push(getFormData());
    document.querySelector("form").reset();
    closeModal();
    emitter.emit("newBook");
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


const DB = (function(){
  class LocalStorage{
    #defaultLibrary = JSON.stringify([
      new Book({
        title: "Atomic Habits", 
        author: "James Clear", 
        pages: 320, 
        read: true 
      }), 
      new Book({
        title: "The power of now", 
        author: "Ekhart Tolle", 
        pages: 236, 
        read: false 
      }),
      new Book({
        title: "Deep work", 
        author: "Cal Newport", 
        pages: 296, 
        read: true
      }),
    ]);
    #state = [];
    constructor(){
      window.localStorage.getItem("books") ||  window.localStorage.setItem("books", this.#defaultLibrary);
      this.#state = JSON.parse(window.localStorage.getItem("books")).map( book => new Book(book) );
      emitter.on("updatedABook", this.#save.bind(this));
      emitter.on("deletedABook", this.#delete.bind(this));
    }
  
    //book = {title, author, pages, read}
    push(book){
      this.#state.push(book);
      window.localStorage.setItem("books", JSON.stringify(this.#state));
    }
  
    getBooks(){
      return this.#state;
    }

    #save = function(){
      window.localStorage.setItem("books", JSON.stringify(this.#state));
    }

    #delete = function(index){
      this.#state.splice(index, 1);
      this.#save();
      emitter.emit("updateState");
    }
  }
  return new LocalStorage();
})();

app.start();