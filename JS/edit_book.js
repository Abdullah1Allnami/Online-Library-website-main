const editForm = document.getElementById("book_details");
const myImage = document.getElementById("cover-pic");
const uploadInput = document.getElementById("upload-img");
const addCategoryButton = document.getElementById("add-category");
const categoryList = document.getElementById("category-list");
let bookInfo;
let was_reset = false;
let photo_changed = false;

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

////////////////// Main functions ////////////////////////////
// Function to get the book ID from the URL parameters
function fetchId() {
  let params = new URLSearchParams(window.location.search);
  return params.get("id");
}
async function getPhoto(photoID) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/photo/${photoID}/`, {
      method: 'GET',
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const photoDisplay = document.getElementById('cover-pic');
      photoDisplay.src = url;
      // photoDisplay.style.display = 'block';
    } else {
      console.error('Photo not found');
    }
  } catch (error) {
    console.error('Error fetching photo:', error);
  }
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
//populate the form with the book data
function populateForm(book) {
  bookInfo = book;
  document.getElementById("book_title").value = book.title;
  fetchAuthorName(book.author)
    .then((authorName) => {
      document.getElementById("author_name").value = authorName;
    })
    .catch((error) => {
      console.error("Error fetching author name:", error);
    });
  document.getElementById("publish_date").value = book.publish_date;
  document.getElementById("category-list").value = book.category.id;
  document.getElementById("description").value = book.description;

  getPhoto(book.cover);
  fetchCategories(book.category);
}
async function fetchAuthorName(authorId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api.authors/${authorId}`
    );
    const data = await response.json();
    return data.name;
  } catch (error) {
    throw new Error("Failed to fetch author name");
  }
}
function fetchCategories(selectedCategoryId) {
  const categoryDropdown = document.getElementById("category-list");
  categoryDropdown.innerHTML = ""; // Clear existing options

  fetch("http://127.0.0.1:8000/api.categories/")
    .then((response) => response.json())
    .then((categories) => {
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        if (category.id === selectedCategoryId) {
          option.selected = true; // Select the book's category
        }
        categoryDropdown.appendChild(option);
      });
    });
}
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
// update the book
async function updateBook(
  bookId,
  title,
  authorId,
  publishDate,
  categoryId,
  description,
  photoID
) {

  return new Promise((resolve, reject) => {
    let bookRequest = new XMLHttpRequest();
    bookRequest.open("PUT", `http://127.0.0.1:8000/api.books/${bookId}/`);
    bookRequest.responseType = "json";
    bookRequest.setRequestHeader("Content-type", "application/json");


    let bookRequestBody = `{
      "title": "${title}",
      "author": ${authorId},
      "category": ${categoryId},
      "publish_date": "${publishDate}",
      "available": true,
      "description": "${description}",
      "cover" : "${photoID}"
    }`;

    bookRequest.onload = function () {
      if (bookRequest.status >= 200 && bookRequest.status < 300) {
        resolve(bookRequest.response);
      } else {
        reject(`Error: ${bookRequest.status}`);
      }
    };

    bookRequest.onerror = function () {
      reject("Network Error");
    };

    bookRequest.send(bookRequestBody);
  });
}
function reset() {
  myImage.src = "../img/book-cover-placeholder.png";
  uploadInput.value = "";
  was_reset = true;
}

//////////// Event handlers ////////////////////
window.onload = async function () {
  const bookId = fetchId();
  await fetch(`http://127.0.0.1:8000/api.books/${bookId}`)
    .then((response) => response.json())
    .then((data) => {populateForm(data)});
};

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const bookId = fetchId();
  const title = document.getElementById("book_title").value.trim();
  const authorName = document.getElementById("author_name").value.trim();
  const publishDate = document.getElementById("publish_date").value;
  const categoryId = document.getElementById("category-list").value;
  const description = document.getElementById("description").value.trim();
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

  // Photo id
  let photoID = bookInfo.cover;
  if (was_reset) {
    photoID = 20;
  }
  else if (photo_changed) {
    const fileInput = document.getElementById('upload-img');
    await uploadPhoto(fileInput)
      .then((response) => {
        photoID = response.id;
      })
  }


  findAuthorIdByName(authorName)
    .then((authorId) => {
      return updateBook(
        bookId,
        title,
        authorId,
        publishDate,
        categoryId,
        description,
        photoID
      );
    })
    .then(() => {
      showMessage("Book Updated Successfully");
      // window.location.href = "all_books.html";
    })
    .catch((error) => {
      showMessage("Error occurred while updating", 'red', false);
      console.error("Error:", error);
    });
});
uploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      myImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
    photo_changed = true;
  }
});
addCategoryButton.addEventListener("click", (event) => {
  const newCategory = prompt("Enter a new category:");
  if (newCategory) {
    addCategory(newCategory);
  }
})
editForm.addEventListener("reset", reset);