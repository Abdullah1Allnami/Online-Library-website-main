const myImage = document.getElementById("cover-pic");
const uploadInput = document.getElementById("upload-img");
const myForm = document.getElementById("book_details");
const categoryList = document.getElementById("category-list");
const addCategoryButton = document.getElementById("add-category");

////////////////////// Event Handlers ///////////////////////////
// Changing the Book Cover
uploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      myImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
// Resting the form
myForm.addEventListener("reset", () => {
  myImage.src = "../img/book-cover-placeholder.png";
  uploadInput.value = "";
});

// Submit
myForm.addEventListener("submit", () => {
  event.preventDefault();
  const Title = document.getElementById("book_title").value.trim();
  const Name = document.getElementById("author_name").value.trim();
  const Date = document.getElementById("publish_date").value;
  var selectElement = document.getElementById("category-list").value;
  const desc = document.getElementById("description").value.trim();

  if (!Title) {
    showMessage("Book Title is required", "red", false);
    return;
  }
  if (!desc) {
    showMessage("Description is required", "red", false);
    return;
  }

  if (!Name) {
    showMessage("Author Name is required", "red", false);
    return;
  }

  if (!Date) {
    showMessage("Publish Date is required", "red", false);
    return;
  }
  if (!selectElement) {
    showMessage("Category is required", "red", false);
    return;
  }

  findAuthorIdByName(document.getElementById("author_name").value)
    .then((id) => addBook(id))
    .then(() => {
      showMessage("Book Added Successfully");
      myForm.reset();
      // window.location.href = "all_books.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

addCategoryButton.addEventListener("click", () => {
  const category = prompt("Enter a new category");
  if (category.trim()) {
    addCategory(category);
  }
})

///////////////////// Request senders ////////////////////////////
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
      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(this.responseText));
      else {
        reject(Error(`Request failed with status code: ${xhr.status}`));
      }
    };
    xhr.send();
  });
}

//////////////////////////// Helping functions //////////////////////
// Add a new category to database
function addCategory(newCategory) {
  loadedRequest("POST", "http://127.0.0.1:8000/api.categories/", {"name": newCategory})
    .then((response) => {
      const option = document.createElement("option");
      option.value = response.id;
      option.textContent = response.name;
      categoryList.add(option);
      categoryList.value = response.id;
    })
}

// Getting the categories
function fetchCategories() {
  emptyRequest("GET", "http://127.0.0.1:8000/api.categories/")
  .then((response) => {
    response.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categoryList.appendChild(option);
    });
  })
}

fetchCategories();

// Creates an author if not found and resolve with its id
function findAuthorIdByName(authorName) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const apiUrl = "http://127.0.0.1:8000/api.authors/";

    xhr.open("GET", apiUrl, true);

    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          const authors = JSON.parse(xhr.responseText);
          const existingAuthor = authors.find(
            (author) => author.name === authorName
          );

          if (existingAuthor) {
            // Author already exists, return their ID
            resolve(existingAuthor.id);
          } else {
            const newAuthorXhr = new XMLHttpRequest();
            newAuthorXhr.open("POST", apiUrl, true);
            newAuthorXhr.setRequestHeader("Content-Type", "application/json");
            newAuthorXhr.onload = function () {
              if (
                newAuthorXhr.readyState === 4 &&
                newAuthorXhr.status === 201
              ) {
                const newAuthorData = JSON.parse(newAuthorXhr.responseText);
                resolve(newAuthorData.id);
              } else {
                reject(newAuthorXhr.statusText);
              }
            };
            newAuthorXhr.onerror = function () {
              reject(newAuthorXhr.statusText);
            };
            newAuthorXhr.send(JSON.stringify({ name: authorName }));
          }
        } catch (error) {
          reject(error);
        }
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.onerror = function () {
      reject(xhr.statusText);
    };

    xhr.send();
  });
}

function uploadPhoto(fileInput) {
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('image', file);

  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:8000/photo/', {
        method: 'POST',
        body: formData,
    })
    .then((response) => resolve(response.json()))
    .catch((error) => reject(error))
  })
}

const markAsBorrowed = (id) => {
  loadedRequest("POST", `http://127.0.0.1:8000/api.BorrowTransaction/`, {
    "user": parseInt(localStorage.user_id),
    "book": id,
  });
}

async function addBook(authorId) {
  const fileInput = document.getElementById("upload-img");
  let photoID = 20;

  // Upload photo if found
  if (uploadInput.value.length > 0) {
    await uploadPhoto(fileInput)
      .then((response) => {
        photoID = response.id;
      })
  }

  // Upload the book
  return new Promise((resolve, reject) => {
    let bookRequest = new XMLHttpRequest();
    bookRequest.open("POST", "http://127.0.0.1:8000/api.books/");
    bookRequest.responseType = "json";
    bookRequest.setRequestHeader("Content-type", "application/json");
    let bookRequestBody = `{
      "title": "${document.getElementById("book_title").value}",
      "author": ${authorId},
      "cover": "${photoID}",
      "rating": ${Math.floor(Math.random() * 5) + 1},
      "category": ${categoryList.value},
      "publish_date": "${document.getElementById("publish_date").value}",
      "available": true,
      "description": "${document.getElementById("description").value}",
      "publisher": ${window.localStorage.getItem("user_id")}
    }`;

    bookRequest.send(bookRequestBody);
    bookRequest.onload = function () {
      if (bookRequest.status >= 200 && bookRequest.status < 300) {
        const bookData = bookRequest.response;
        markAsBorrowed(bookData.id);
        resolve(bookData.id);
      } else {
        reject(`Error: ${bookRequest.status}`);
      }
    };

    bookRequest.onerror = function () {
      reject("Network Error");
    };
  });
}