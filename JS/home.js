function succsessRegistiration()
{
    let isLogin = JSON.parse(window.localStorage.getItem("isLogin"));
    let isSignUp = JSON.parse(window.localStorage.getItem("isSignUp"));
    
    if(isLogin)
    {
        showMessage("Login in is succsess");
        localStorage.removeItem("isLogin");
    }
    
    if(isSignUp)
    {
        showMessage("Registration Successfully");
        localStorage.removeItem("isSignUp");
    }

}

/* dispaly the most recent 5 books */

async function get_src(photoId) {
    const response = await fetch(`http://127.0.0.1:8000/photo/${photoId}/`, {
        method: 'GET',
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
    } else {
        return `../img/book-cover-placeholder.png`;
    }
}

async function addBook(id, title, cover, author){
    let bookCover = await get_src(cover);
    let book =
    `
        <div class="Book"  data-category="">
        <div class="background-img">
        <a href="../HTML/book.html?id=${id}">
        <img src="${bookCover}" alt="">
        </a>
        </div>
        <div class="content">
        <h3>${title}</h3> 
        <span><strong>Author(s):</strong>${author}</span>
        <a href="../HTML/book.html?id=${id}">
        <button id= "ShowDetails">Show details</button> 
        </a>
        </div>
        </div>
    `;
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(book, "text/html");
    let recentBooks = document.getElementsByClassName("recent-books")[0];
    recentBooks.append(parsedDocument.querySelector(".book"));
}

function dispalyRecentBooks()
{
    fetch(`http://127.0.0.1:8000/api.books/`).then((res) =>{
        let myData = res.json();
        return myData;
    }).then((books) => {
        console.log(books);
        for(let i = books.length - 1; i >= books.length - 5 && i >= 0; i--){
            fetch(`http://127.0.0.1:8000/api.authors/${books[i].author}/`).then((res) => {
                let author = res.json();
                return author;
            }).then((author) => {
                addBook(books[i].id, books[i].title, books[i].cover, author.name);
            })
        }
    })


}



/* search for a book */

let searchButton = document.querySelector("[type='submit']");
let searchBar = document.querySelector("#search");

searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    let searchValue = searchBar.value;
    let url = window.location.href;
    let newUrl = url.replace("Home.html", "all_books.html");
    window.location.href = newUrl;

    // store the search value in the session storage
    sessionStorage.setItem("searchValue", searchValue);
});


succsessRegistiration();
dispalyRecentBooks();