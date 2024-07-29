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
class User {
  constructor(
    userName,
    password,
    email,
    isAdmin,
    firstName,
    lastName,
    imageURL,
    books,
    favorites,
    phoneNumber
  ) {
    this.userName = userName;
    this.password = password;
    this.email = email;
    this.isAdmin = isAdmin;
    this.firstName = firstName;
    this.lastName = lastName;
    this.imageURL = imageURL;
    this.books = books;
    this.favorites = favorites;
    this.phoneNumber = phoneNumber;
  }
}

const myImage = document.getElementById("cover-pic");
const uploadInput = document.getElementById("upload-img");
const myForm = document.getElementById("book_details");
const categoryList = document.getElementById("category-list");

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

  let booksJSON = window.localStorage.getItem("books");
  let updatedJSON, booksArr;

  if (booksJSON) {
    booksArr = JSON.parse(booksJSON);
    booksArr.push(newBook);
    updatedJSON = JSON.stringify(booksArr);
  } else {
    updatedJSON = JSON.stringify([newBook]);
  }
  window.localStorage.setItem("books", updatedJSON);


  ///////////////
  //  Admin Part/
  ///////////////
  let usersJSON = window.localStorage.getItem("users");
  let updatedJSONuser, usersArr;

  if (usersJSON) {
    usersArr = JSON.parse(usersJSON);
    let id = JSON.parse(window.localStorage.getItem("books")).length - 1;
    usersArr[userId].books.push(id);
    updatedJSONuser = JSON.stringify(usersArr);
  }

  window.localStorage.setItem("users", updatedJSONuser);
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

///////////////
///categories//
///////////////
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
