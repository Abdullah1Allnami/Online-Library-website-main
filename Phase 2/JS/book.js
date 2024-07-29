const bookImage = document.querySelector("#book-image");
const zoomContainer = document.querySelector(".zoom-container");
const zoomedImage = document.querySelector("#zoomed-image");
const bookTitle = document.querySelector(".book-title > h1");
const bookAuthor = document.querySelector(".book-title > p");
const categoryField = document.querySelector("#category-field");
const dateField = document.querySelector("#date-field");
const statusBanner = document.querySelector("#status-banner");
const statusIco = document.querySelector("#status-icon");
const statusBlock = document.querySelector("#status-block");
const borrowBtn = document.querySelector("#borrow-btn");
const favBtn = document.querySelector("#fav-btn");
const descriptionBox = document.querySelector(".description > p");
const userID = JSON.parse(window.sessionStorage.getItem("user_id")); // NaN means that current user didn't login
const isAdmin = JSON.parse(window.sessionStorage.getItem("isAdmin"));
let bookId = -1;

class Book {
    constructor(
        imageURL,
        title,
        author,
        category,
        publishDate,
        description,
        availability
    ) {
        this.title = title;
        this.imageURL = imageURL;
        this.author = author;
        this.category = category;
        this.availability = availability;
        this.description = description;
        this.publishDate = publishDate;
    }
}

// --------------- Functions ------------------
// Rating
function addRating() {
    let stars = document.querySelectorAll(".stars > span");
    let n = Math.floor(Math.random() * 6);

    for (let i = 0; i < n; ++i) {
        stars[i].classList.add("checked");
    }

}

// removes the current book
function removeCurrentBook() {
    // ----- Removing from all books
    let books = JSON.parse(window.localStorage.getItem("books"));
    delete books[bookId];

    // Returning back to JSON;
    window.localStorage.setItem("books", JSON.stringify(books));

    // ----- Remove from admin books
    let users = JSON.parse(window.localStorage.users);
    for (let i = 0; i < users[userID].books.length; ++i) {
        if (users[userID].books[i] == bookId) {
            users[userID].books.splice(i, 1);
        }
    }
    // pushing back
    window.localStorage.users = JSON.stringify(users);

    // Disabling buttons
    borrowBtn.disabled = true;
    favBtn.disabled = true;

    // Showing the message
    showMessage(
        `${bookTitle.innerHTML} has been deleted successfully`,
        "#42BD6C",
        true
    );

    // Directing to Books page
    setTimeout(() => (window.location.href = "all_books.html"), 4000);
}

// Checks the type of user to display and un-display stuff
function authorizeUser() {
    // if user or admin
    if (Number.isInteger(userID)) {
        // if only an admin
        if (isAdmin) {
            // Search for the book in his list of added books
            let userObj = JSON.parse(window.localStorage.getItem("users"))[
                userID
            ];
            for (let id of userObj.books) {
                if (id == bookId) {
                    // Adding remove and edit buttons
                    let parser = new DOMParser();
                    document
                        .querySelector(".image-side")
                        .appendChild(
                            parser
                                .parseFromString(
                                    '<div class="admin-btns"><button id="edit-btn"><span class="material-symbols-rounded">edit</span>Edit</button><button id="remove-btn"><span class="material-symbols-rounded">delete</span>Remove</button></div>',
                                    "text/html"
                                )
                                .querySelector(".admin-btns")
                        );

                    // Adding functionality
                    document
                        .getElementById("edit-btn")
                        .addEventListener("click", () => {
                            window.location.href = `edit_book.html?id=${bookId}`;
                        });
                    document
                        .getElementById("remove-btn")
                        .addEventListener("click", removeCurrentBook);
                }
            }
        }
    }
}

// Fetching the book data using its id
function fetchData(bookId) {
    let books = JSON.parse(window.localStorage.getItem("books"));
    let currentBook = books[bookId];
    // Updating page details
    if (currentBook.imageURL) {
        bookImage.src = currentBook.imageURL;
        zoomedImage.src = currentBook.imageURL;
    }
    bookTitle.innerHTML = currentBook.title;
    bookAuthor.innerHTML = currentBook.author;
    categoryField.innerHTML = currentBook.category;
    dateField.innerHTML = currentBook.publishDate;
    descriptionBox.innerHTML = currentBook.description;

    if (currentBook.availability) {
        statusBanner.innerHTML = "available";
        statusBlock.innerHTML =
            '<span class="material-symbols-rounded" id="status-icon">mood</span>available';
        statusBanner.style.backgroundColor = "#56cb5b";
        statusBlock.style.backgroundColor = "#56cb5b";
    } else {
        statusBanner.innerHTML = "unavailable";
        statusBlock.innerHTML =
            '<span class="material-symbols-rounded" id="status-icon">sentiment_dissatisfied</span>unavailable';
        statusBanner.style.backgroundColor = "#dd4034";
        statusBlock.style.backgroundColor = "#dd4034";
    }

    addRating();
}

// Fetches the book id from the page url
function fetchId() {
    let psearch = new URLSearchParams(window.location.search);
    return parseInt(psearch.get("id"));
}

// Checks if the id is already valid and found in books
function checkId(bookId) {
    if (bookId == NaN) {
        return false;
    } else {
        let books = JSON.parse(window.localStorage.getItem("books"));
        if (books && bookId < books.length && bookId >= 0 && books[bookId]) {
            return true;
        } else {
            return false;
        }
    }
}

// -------------------- Main ---------------------
bookId = fetchId();

if (checkId(bookId)) {
    // check the type of visitor
    authorizeUser();

    // fetching the data
    fetchData(bookId);

    // Do other stuff

    // Borrow button handling
    borrowBtn.addEventListener("click", () => {
        // regular visitor
        if (!Number.isInteger(userID)) {
            showMessage(
                "You need to be logged in to borrow this book",
                "#f44336",
                false
            );
        }
        // admin
        else if (isAdmin) {
            showMessage("Admins cannot borrow books", "#f44336", false);
        }
        // user
        else {
            // check book availability
            let books = JSON.parse(window.localStorage.getItem("books"));
            if (!books[bookId].availability) {
                showMessage("This book is unavailable", "#f44336", false);
            } 
            else {
                let users = JSON.parse(window.localStorage.getItem("users"));
                
                // check if already borrowed before
                let borrowed = false;
                for (let id of users[userID].books) {
                    if (id == bookId) {
                        borrowed = true;
                        showMessage(
                            "This book has been already borrowed to your favorites",
                            "#d38902",
                            true
                        );
                    }
                }
                
                if (!borrowed) {
                    // add to his list of books
                    users[userID].books.push(bookId);
                    window.localStorage.setItem("users", JSON.stringify(users));
    
                    // make unavailable
                    books[bookId].availability = false;
                    window.localStorage.setItem("books", JSON.stringify(books));
                }

                showMessage("The book has been borrowed successfully", "#42BD6C", true);
            }
        }
    });

    // Add to favorites
    favBtn.addEventListener("click", () => {
        // regular visitor
        if (!Number.isInteger(userID)) {
            showMessage(
                "You need to be logged in to add to favorites",
                "#f44336",
                false
            );
        }

        // user or admin
        else {
            // fetching all users
            let users = JSON.parse(window.localStorage.getItem("users"));
            // check if already added before
            let added = false;
            for (let id of users[userID].favorites) {
                if (id == bookId) {
                    added = true;
                    showMessage(
                        "This book has been already added to your favorites",
                        "#d38902",
                        true
                    );
                }
            }

            if (!added) {
                // adding the book to favorites
                users[userID].favorites.push(bookId);
                // pushing back the users json
                window.localStorage.setItem("users", JSON.stringify(users));

                showMessage(
                    "The book has been added to your favorites successfully",
                    "#42BD6C",
                    true
                );
            }
        }
    });

    // Adding the zooming event to book image in-case of wide screen
    if (screen.width > 768) {
        bookImage.addEventListener("mousemove", (e) => {
            // Showing the container
            zoomContainer.style.display = "block";

            // Extracting the current width and height
            let width = parseFloat(window.getComputedStyle(bookImage).width);
            let height = parseFloat(window.getComputedStyle(bookImage).height);

            // Extracting the current mouse position portion
            let x = e.offsetX / width;
            let y = e.offsetY / height;

            // Preserving x & y in the container
            if (x >= 0.95) {
                x = 0.95;
            }
            if (y >= 0.935) {
                y = 0.935;
            }

            // Zooming the current part
            zoomedImage.style.transform = `translate(-${x * 100 * 0.6}%, -${
                y * 100 * 0.8
            }%)`;
        });

        bookImage.addEventListener("mouseleave", (e) => {
            zoomContainer.style.display = "none";
        });
    }
} else {
    favBtn.disabled = true;
    borrowBtn.disabled = true;
    showMessage("This book is undefined", "#f44336", false);
}
