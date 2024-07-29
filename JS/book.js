const bookImage = document.querySelector("#book-image");
const zoomBox = document.querySelector(".zoom-box");
const bookTitle = document.querySelector(".book-title > h1");
const bookAuthor = document.querySelector(".book-title > p");
const categoryField = document.querySelector("#category-field");
const dateField = document.querySelector("#date-field");
const statusBanner = document.querySelector("#status-banner");
const statusField = document.querySelector(".status-field");
const statusFieldIcon = document.querySelector("#status-field-icon");
const statusFieldText = document.querySelector("#status-field-text");
const favBtn = document.querySelector("#favorite-button");
const borrowBtn = document.querySelector("#borrow-button");
const adminButtons = document.querySelector(".admin-buttons");
const descriptionBox = document.querySelector(".description > p");
let user = null;
let book = null;

// ----------------- Utilities ------------------
// Gets root url
const getBaseUrl = () => {
  // return `${window.location.protocol}//${window.location.host}`;
  return "http://127.0.0.1:8000";
};

// Fetches the book id from the page url
const fetchId = () => {
  let params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Rating
const addRating = (n = 0) => {
  const stars = document.querySelectorAll("#rate > span");
  for (let i = 0; i < n; ++i) {
    stars[i].classList.add("checked");
  }
}

const today = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ---------------- Request functions -----------
const loadedRequest = (method, url, body) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = "json";

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(this.response);
      } else {
        reject(Error(`Request failed with status code: ${this.status}`));
      }
    };
    xhr.send(JSON.stringify(body));
  });
}

// Made for empty requests such as delete and get
const emptyRequest = (method, url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) resolve(this.responseText);
      else {
        reject(Error(`Request failed with status code: ${xhr.status}`));
      }
    };
    xhr.send();
  });
}

function setAvailability(isAvailable) {
  if (isAvailable) {
    statusFieldIcon.textContent = "check_circle";
    statusBanner.textContent = statusFieldText.textContent = "available";
    statusBanner.style.backgroundColor = statusField.style.backgroundColor = "var(--available-bg-color)";
  }
  else {
    statusFieldIcon.textContent = "cancel";
    statusBanner.textContent = statusFieldText.textContent = "unavailable";
    statusBanner.style.backgroundColor = statusField.style.backgroundColor = "var(--unavailable-bg-color)";
  }

}

// check if the current book is in favorites
function checkFavorites() {
  emptyRequest("GET", `${getBaseUrl()}/api.favorites/`).then((favorites) => {
    const json = JSON.parse(favorites);
    for (let i = 0; i < json.length; ++i) {
      if (json[i].user == user.id && json[i].book == book.id) {
        favBtn.dataset.state = json[i].id;
        favBtn.querySelector(".heart-icon").classList.add("liked");
        return;
      }
      favBtn.dataset.state = 0;
      favBtn.querySelector(".heart-icon").classList.remove("liked");
    }
  });
}

// checks if the current book is borrowed
function checkBorrowed() {
  return new Promise((resolve, reject) => {
    emptyRequest("GET", `${getBaseUrl()}/api.BorrowTransaction/`)
      .then((borrows) => {
        const json = JSON.parse(borrows);
        for (let i = 0; i < json.length; ++i) {
          if (json[i].user == user.id && json[i].book == book.id) {
            borrowBtn.dataset.state = json[i].id;
            borrowBtn.classList.add("borrowed");
            borrowBtn.innerHTML = '<span class="material-symbols-rounded icon">book</span>Borrowed';
            resolve(true);
            return;
          }
        }
        borrowBtn.dataset.state = 0;
        borrowBtn.classList.remove("checked");
        borrowBtn.innerHTML = '<span class="material-symbols-rounded icon">book</span>Borrow';
        resolve(false);
      })
      .catch((error) => reject(error));
  });
}

// make it toggle its state from borrowed to not borrowed
function toggleBorrowing() {
  borrowBtn.classList.toggle("borrowed");
  if (+borrowBtn.dataset.state > 0) {
    showMessage("Returned successfully", "#42BD6C", true);
    borrowBtn.innerHTML = '<span class="material-symbols-rounded icon">book</span>Borrow';
    emptyRequest("DELETE", `${getBaseUrl()}/api.BorrowTransaction/${borrowBtn.dataset.state}/`)
      .then(() => {
        borrowBtn.dataset.state = 0;
        // update availability
        book.available = true;
        loadedRequest("PUT", `${getBaseUrl()}/api.books/${book.id}/`, book);
      });
  }
  else {
    showMessage("Borrowed successfully", "#42BD6C", true);
    borrowBtn.innerHTML = '<span class="material-symbols-rounded icon">book</span>Borrowed';
    loadedRequest("POST", `${getBaseUrl()}/api.BorrowTransaction/`, {
      "user": user.id,
      "book": book.id,
    }).then((response) => {
      // update dataset
      borrowBtn.dataset.state = response.id;
      book.available = false;
      loadedRequest("PUT", `${getBaseUrl()}/api.books/${book.id}/`, book);
    });
  }
}

// Make it toggle its state from favorite to not favorite
function toggleFavoritesButton() {
  favBtn.querySelector(".heart-icon").classList.toggle("liked");
  if (+favBtn.dataset.state > 0) {
    emptyRequest("DELETE", `${getBaseUrl()}/api.favorites/${favBtn.dataset.state}/`)
      .then(() => {
        favBtn.dataset.state = 0;
      });
  }
  else {
    loadedRequest("POST", `${getBaseUrl()}/api.favorites/`, {
      "user": user.id,
      "book": book.id,
    }).then((response) => {
      favBtn.dataset.state = response.id;
    });
  }
}

const setZoomOnHover = () => {
  bookImage.addEventListener("mousemove", (e) => {
    // Showing the container
    zoomBox.style.display = "block";

    // Extracting the current width and height
    let width = parseFloat(window.getComputedStyle(bookImage).width);
    let height = parseFloat(window.getComputedStyle(bookImage).height);

    // Extracting the current mouse position portion
    let x = e.offsetX / width;
    let y = e.offsetY / height;

    // Moving to the current part
    zoomBox.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
  });

  bookImage.addEventListener("mouseleave", (e) => {
    zoomBox.style.display = "none";
  });
}

// Gets the book cover
const getCover = () => {
  const photoId = book.cover;
  fetch(`${getBaseUrl()}/photo/${photoId}/`, {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        response.blob().then((blob) => {
          const url = URL.createObjectURL(blob);
          bookImage.src = url;
          zoomBox.style.backgroundImage = `url(${url})`;
          if (photoId != 20) {
            setZoomOnHover();
          }
        });
      } else {
        console.error('Photo not found');
      }
    })
    .catch((error) => {
      console.error('Error fetching photo:', error);
    })
}

// Fetching the book data using its id
function updatePage(id) {
  return new Promise((resolve, reject) => {
    emptyRequest("GET", `${getBaseUrl()}/api.books/${id}/`).then((json) => {
      book = JSON.parse(json);

      bookTitle.innerHTML = book.title;
      dateField.innerHTML = book.publish_date;
      descriptionBox.innerHTML = book.description;
      addRating(book.rating);
      setAvailability(book.available);
      getCover();

      // Author
      emptyRequest("GET", `${getBaseUrl()}/api.authors/${book.author}/`)
        .then((author) => {
          bookAuthor.innerHTML = JSON.parse(author).name;
        })
        .catch(() => {
          bookAuthor.innerHTML = "Unknown";
        });

      // Category
      emptyRequest("GET", `${getBaseUrl()}/api.categories/${book.category}/`)
        .then((category) => {
          categoryField.innerHTML = JSON.parse(category).name;
        })
        .catch(() => {
          categoryField.innerHTML = "Undefined";
        });

      resolve(book);
    }).catch(() => {
      console.error("Error occurred while fetching book data");
      reject(book);
    });
  });
}

// Adding admin buttons
function handleButtons() {
  // unauthenticated user
  if (!user) {
    adminButtons.remove();
    borrowBtn.disabled = true;
    favBtn.classList.toggle("disabled");
  }
  else if (user.isAdmin) {
    borrowBtn.remove();
    if (user.id != book.publisher) {
      adminButtons.remove();
    }
  }
  else {
    adminButtons.remove();

    // Check borrow button status
    checkBorrowed().then((borrowed) => {
      // Apply borrowBtn disabled on unavailable books
      // If I'm not the user who borrowed
      if (!borrowed) {
        borrowBtn.disabled = !book.available;
      }
    })

  }
  document.querySelector(".dynamic-buttons").style.display = 'block';
}

// ------------------ Admin related -------------------
// removes the current book
const removeBook = (bookId) => {
  // ----- Removing from all books
  openModal("Remove a book", `Are you sure to remove '${book.title}'?`, {
    warning: "By proceeding with this, you will remove all tis book details permanently",
    actionButton: () => {
      emptyRequest("DELETE", `${getBaseUrl()}/api.books/${bookId}/`)
        // TODO: Forward to all books page
        .then(() => showMessage(`${bookTitle.innerHTML} has been deleted successfully`, "#42BD6C", true))
        .catch(() => showMessage(`${bookTitle.innerHTML} is not found in the library books`, "#f44336", true));
    }
  })
}

// -------------------- Main ---------------------
function main() {
  // Assumed that django will only display valid urls with valid ids
  let bookId = fetchId();

  updatePage(bookId)
    .then(() => {
      emptyRequest("GET", `${getBaseUrl()}/api.users/${localStorage.user_id}/`)
        .then((json) => {
          user = JSON.parse(json);
          checkFavorites();
        })
        .catch((error) => console.error(error, "User is not defined"))
        .finally(() => handleButtons());
    });
}


main();

// Button events handlers
borrowBtn.addEventListener("click", () => toggleBorrowing())

// Add to favorites
favBtn.addEventListener("click", (e) => {
  // regular visitor
  if (!user) {
    showMessage(
      "You need to be logged in to add to favorites",
      "#f44336",
      false
    );
  }
  else {
    toggleFavoritesButton();
  }
});

// Handles edit button
adminButtons.querySelector(".edit-button").addEventListener("click", (e) => {
  // go to edit book page
  window.location = `edit_book.html?id=${book.id}`;
});

// Handles remove button 
adminButtons.querySelector(".delete-button").addEventListener("click", (e) => {
  removeBook(book.id);
});
