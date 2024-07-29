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

const myImage = document.getElementById("cover-pic");
const uploadInput = document.getElementById("upload-img");
const myForm = document.getElementById("book_details");
const categoryList = document.getElementById("category-list");

// Retrieve data from local storage
const books = JSON.parse(window.localStorage.getItem("books"));
let id = JSON.parse(window.localStorage.getItem("single-book-id"));
let currentBook = books[id];

// Populate input fields with retrieved data
document.getElementById("book_title").value = currentBook?.title || "";
document.getElementById("description").value = currentBook?.description || "";
document.getElementById("author_name").value = currentBook?.author || "";
document.getElementById("publish_date").value = currentBook?.publishDate || "";
document.getElementById("cover-pic").src = currentBook?.imageURL || "";
// Functions
function addBookToCategory(bookIndex, categoryName) {
  // getting categories json
  const categoryJSON = window.localStorage.getItem("categories");
  const categoryArr = JSON.parse(categoryJSON);

  // finding the category with name
  for (let category of categoryArr) {
    if (category.name == categoryName) {
      category.books.push(bookIndex);
    }
  }
}

function addBook() {
  // Creating the book object
  const newBook = new Book(
    myImage.src,
    document.getElementById("book_title").value,
    document.getElementById("author_name").value,
    categoryList.value,
    document.getElementById("publish_date").value,
    true,
    document.getElementById("description").value
  );

  // Retrieve existing books from local storage
  let booksJSON = window.localStorage.getItem("books");
  let booksArr = booksJSON ? JSON.parse(booksJSON) : [];

  // Replace the current book data (if it exists)
  if (id >= 0 && id < booksArr.length) {
    booksArr[id] = newBook;
  } else {
    // Handle the case where the book doesn't exist (e.g., invalid ID)
    console.error("Invalid book ID:", id);
    return;
  }

  // Update local storage with the modified book array
  window.localStorage.setItem("books", JSON.stringify(booksArr));

  // Adding the book to its category (if a category is selected)
  if (!categoryList.disabled) {
    addBookToCategory(id, categoryList.value);
  }
  // window.open("all_books.html");
}

function fetchCategories() {
  let categories;

  // getting local storage
  categories = JSON.parse(window.localStorage.getItem("categories"));

  // Getting category names
  if (categories) {
    let categoryNames = categories.map((category) => category.name);

    for (let name of categoryNames) {
      let option = new Option(name, name);
      categoryList.appendChild(option);
    }
  } else {
    categoryList.disabled = true;
  }
}

function reset() {
  myImage.src = "../img/book-cover-placeholder.png";
  // fetchCategories();
}

// Events
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
myForm.addEventListener("submit", addBook);
myForm.addEventListener("reset", reset);

// Calling functions
// fetchCategories();

//----------------- Form Validation

document.addEventListener("DOMContentLoaded", function () {
  const myForm = document.getElementById("book_details");

  myForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const bookTitle = document.getElementById("book_title").value.trim();
    const authorName = document.getElementById("author_name").value.trim();
    const publishDate = document.getElementById("publish_date").value;

    if (!bookTitle) {
      alert("Please enter a book title.");
      return;
    }

    if (!authorName) {
      alert("Please enter an author name.");
      return;
    }

    if (!publishDate) {
      alert("Please select a publish date.");
      return;
    }
    myForm.preventDefault;
    myForm.submit();
    window.location.href = "all_books.html";
  });
});

///category

function getCategoriesFromLocalStorage() {
  const storedBooks = JSON.parse(localStorage.getItem("books"));
  const uniqueCategories = new Set();

  // Extract unique categories from stored books
  if (storedBooks) {
    storedBooks.forEach((book) => {
      if (book.category) {
        uniqueCategories.add(book.category);
      }
    });
  } else {
    return;
  }

  return Array.from(uniqueCategories);
}

function saveCategoryToLocalStorage(newCategory) {
  const existingCategories = JSON.parse(localStorage.getItem("")) || [];

  if (!existingCategories.includes(newCategory)) {
    existingCategories.push(newCategory);

    localStorage.setItem("BooksCategories", JSON.stringify(existingCategories));
  }
}
const existingCategories = getCategoriesFromLocalStorage();

// Populate the dropdown with existing categories
const categoryDropdown = document.getElementById("category-list");
if (existingCategories) {
  existingCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryDropdown.appendChild(option);
  });
}

const addCategoryOption = document.createElement("option");
addCategoryOption.value = "add-new";
addCategoryOption.textContent = "Add New Category";
categoryDropdown.appendChild(addCategoryOption);

categoryDropdown.addEventListener("change", (event) => {
  if (event.target.value === "add-new") {
    const newCategory = prompt("Enter a new category:");
    if (newCategory) {
      saveCategoryToLocalStorage(newCategory);

      const newOption = document.createElement("option");
      newOption.value = newCategory;
      newOption.textContent = newCategory;
      categoryDropdown.insertBefore(newOption, addCategoryOption);
      categoryDropdown.value = newCategory; // Select the new category
    }
  }
});
