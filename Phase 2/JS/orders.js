let userData = JSON.parse(window.localStorage.getItem("users"));
let curUser = userData[userId];


let order = `
    <div class="order">
            <div class="order-id">#12545</div>
            <div class="info">
              <div class="title">Advanced Calculus</div>
              <div class="info-divider">
                <hr class="order-divider">
              </div>
              <div class="order-date-container">
                <div id="order-date">
                  <i class="fa-solid fa-calendar-days"></i> March 5, 2022
                </div>
                <div id="order-address">
                  <i class="fa-solid fa-location-dot"></i> 132 Main St
                </div>
                <div id="in-use-order-status">In-use</div>
              </div>
              <div class="des">
                Classic text leads from elementary calculus into more theoretic
                problems. Precise approach with definitions, theorems, proofs,
                examples and exercises. Topics include partial differentiation,
                vectors, differential geometry, infinite series, gamma function,
                Fourier series, Laplace transform, much more. Numerous graded
                exercises with selected answers.
              </div>
              <div id="toggle-buttons">
                <button class="expand-button">Open Book</button>
                <button class="cancel-button">Cancel Order</button>
              </div>
            </div>
            <div class="cover-and-price">
              <div id="book-cover">
                <img src="../img/Calculus.webp" />
              </div>
              <!-- <div id="order-price">$19.99</div> -->
            </div>
        </div>
`;

function AddAllBooks() {
  let books = JSON.parse(window.localStorage.getItem("books"));
  const usersArr = JSON.parse(window.localStorage.getItem("users"));
  let booksID = usersArr[userId].books;
  console.log(booksID);
  console.log(booksID.length);
  if(booksID.length){
      
  }
  else{
      showMessage("this there wrong in AddAllBooks", "red", false)
      return;
  }

  for (let i = 0; i < booksID.length; i += 1) {
      let curBookID = booksID[i];
      if (books[curBookID]) {
          let currentBook = books[curBookID];
          console.log(currentBook);
          let order = `
          <div class="order">
            <div class="order-id">#${curBookID}</div>
            <div class="info">
              <div class="title">${currentBook.title}</div>
              <div class="info-divider">
                <hr class="order-divider">
              </div>
              <div class="order-date-container">
                <div id="order-date">
                  <i class="fa-solid fa-calendar-days"></i> ${currentBook.publishDate}
                </div>
                <div id="order-address">
                  <i class="fa-solid fa-location-dot"></i> 132 Main St
                </div>
                <div id="in-use-order-status">In-use</div>
              </div>
              <div class="des">
                ${currentBook.description}
              </div>
              <div id="toggle-buttons">
                <button class="expand-button">Open Book</button>
                <button class="cancel-button">Cancel Order</button>
              </div>
            </div>
            <div class="cover-and-price">
              <div id="book-cover">
                <img src=${currentBook.imageURL} />
              </div>
            </div>
        </div>
          `;

          const parser = new DOMParser();
          const parsedDocument = parser.parseFromString(order, "text/html");
          
          let MyMain = document.querySelector(".order-list");
          MyMain.append(parsedDocument.querySelector(".order"));
          document.querySelector("#book-cover img").style.width = "150px";
      }
  }
}

AddAllBooks();