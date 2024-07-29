AddAllBooks();

if (sessionStorage.getItem("searchValue")) {
    window.onload = searchBooks();
}

function searchBooks() {

    var input, filter, books, i, title, author, txtValue, authorValue;

    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    books = document.querySelectorAll(".Book");

    // if there is a searchValue in the session storage,
    // get it and set the search input value to it.
    // This is used in the home page search bar
    if (sessionStorage.getItem("searchValue")) {
        input.value = sessionStorage.getItem("searchValue");
        filter = input.value.toUpperCase();
        sessionStorage.removeItem("searchValue");
        input.focus();
    }

    for (i = 0; i < books.length; i++) {

        title = books[i].querySelector("h3");
        author = books[i].querySelector("span");

        txtValue = title.innerText.toUpperCase();
        authorValue = author.innerText.toUpperCase();

        if (txtValue.indexOf(filter) > -1 || authorValue.indexOf(filter) > -1) { books[i].style.display = ""; }

        else { books[i].style.display = "none"; }

    }
}

function filterByCategory() {

    var selectBox = document.getElementById("categorySelect");
    var selectedCategory = selectBox.value;
    var books = document.querySelectorAll(".Book");

    if (books) {

        for (var i = 0; i < books.length; i++) {

            var bookCategory = books[i].getAttribute("data-category");

            if (selectedCategory === "all" || bookCategory === selectedCategory) { books[i].style.display = ""; }

            else { books[i].style.display = "none"; }

        }
    }
}

class Book {
    constructor(
        imageURL,
        title,
        author,
        category,
        publishDate,
        availability,
        description
    ) {
        this.imageURL = imageURL;
        this.title = title;
        this.author = author;
        this.category = category;
        this.publishDate = publishDate;
        this.availability = availability;
        this.description = description;
    }
}

function set_category_select_list() {
    let books = JSON.parse(window.localStorage.getItem("books"));
    let select_list = document.getElementById("categorySelect");
    let uniqueCategories = new Set();

    if (books) {
        for (let i = 0; i < books.length; ++i) {
            const category = books[i].category;
            if (!uniqueCategories.has(category)) {
                let option = document.createElement("option");
                option.value = category;
                option.text = category;
                select_list.add(option);
                uniqueCategories.add(category);
            }
        }
    }
}

function AddAllBooks() {

    let books = JSON.parse(window.localStorage.getItem("books"));

    if (!books) return;

    for (let i = 0; i < books.length; i += 1) {

        if (books[i]) {
            let currentBook = books[i];
            let book =
                `;
            <div class="Book"  data-category="${currentBook.category}">
                <div class="background-img">
                    <a href="../HTML/book.html?id=${i}">
                        <img src="${books[i].imageURL}" />
                    </a>
                </div>
                <div class="content">
                    <h3>${currentBook.title}</h3> 
                    <span><strong>Author(s):</strong>${currentBook.author}</span>
                    <a href="../HTML/book.html?id=${i}">
                    <button id= "ShowDetails">Show details</button> 
                    </a>
                </div>
            </div>
            `;

            const parser = new DOMParser();
            const parsedDocument = parser.parseFromString(book, "text/html");

            let MyMain = document.querySelector(".main-books");
            MyMain.append(parsedDocument.querySelector(".book"));
        }
    }
}


function fetchID() {

    let books = document.querySelectorAll(".Book");
    let buttons = document.querySelectorAll(".Book button");

    for (let i = 0; i < books.length; ++i) {
        buttons[i].onclick = function () {
            window.localStorage.setItem("single-book-id", i);
        };
    }
}

fetchID();

// Link addBook button with addBook page
document.getElementById("addBook").addEventListener("click", function () {
    window.location.href = "../HTML/add_book.html";
});

// Show addBook button for Admin only
function addBookButton(){
    let isAdmin = JSON.parse(window.sessionStorage.getItem("isAdmin"));
    if (isAdmin == null || isAdmin == false) {
        document.getElementById("addBook").style.display = "none";
    }
}

addBookButton();
set_category_select_list();