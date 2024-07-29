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


async function AddAllBooks() {
    
    let request =  new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:8000/api.favorites/");
    request.send();
    // let coverSrc = await get_src(data[i]["cover"]);
    request.onload = () =>{
        let data = JSON.parse(request.responseText);
        let booksIDs = [];
        for(const T of  data){
            if(T["user"] == userId)
                booksIDs.push(T["book"]);
        }
        
        for(const bookID of booksIDs){
            let bookRequest = new XMLHttpRequest();
            bookRequest.open("GET", `http://127.0.0.1:8000/api.books/${bookID}`);
            bookRequest.send();
            bookRequest.onload = () =>{
                console.log(booksIDs);
                let authorRequest = new XMLHttpRequest();
                let bookData = JSON.parse(bookRequest.responseText);
                authorRequest.open("GET", `http://127.0.0.1:8000/api.authors/${bookData["author"]}/`);
                authorRequest.send();
                authorRequest.onload = async() =>{
                    let bookCover = await get_src(bookData["cover"]);
                    let book =
                    `
                    <div class="Book">
                        <div class="background-img">
                            <a href="../HTML/book.html?id=${bookID}">
                                <img src= "${bookCover}"/>
                            </a>
                        </div>
                        <div class="content-book">
                            <h3>${bookData["title"]}</h3> 
                            <span><strong>Author(s):</strong>${JSON.parse(authorRequest.responseText)["name"]}</span>
                            <a href="../HTML/book.html?id=${bookID}">
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
    }
}

AddAllBooks();