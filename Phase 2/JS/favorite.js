function AddAllBooks() {
    let books = JSON.parse(window.localStorage.getItem("books"));
    const usersArr = JSON.parse(window.localStorage.getItem("users"));
    let favoriteID = usersArr[userId].favorites;
    console.log(favoriteID);
    if(favoriteID){
        
    }
    else{
        showMessage("this there wrong in AddAllBooks", "red", false)
        return;

    }

    for (let i = 0; i < favoriteID.length; i += 1) {
        let curBookID = favoriteID[i];
        if (books[curBookID]) {
            let currentBook = books[curBookID];
            let book =
                `
                <div class="Book">
                    <div class="background-img">
                        <a href="../HTML/book.html?id=${curBookID}">
                            <img src="${currentBook.imageURL}" />
                        </a>
                    </div>
                    <div class="content-book">
                        <h3>${currentBook.title}</h3> 
                        <span><strong>Author(s):</strong>${currentBook.author}</span>
                        <a href="../HTML/book.html?id=${curBookID}">
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

AddAllBooks();