let userId = JSON.parse(window.sessionStorage.getItem("user_id"));
let headImageUrl = "../img/profile-icon.png";

function displayHeader() {
  let header = `
    <link rel="shortcut icon" type="x-icon" href="../img/ICON.png">
    <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
    <header class="website-header">
    <div class="logo">
    <a href="Home.html">
    <img src="../img/ICON.png" alt="ICON error path" width="70"/>
    </a>
    <a href="Home.html"> <h1>OnlineLibrary</h1> </a>
    </div>
    
    <nav class="nav-links">
    <ul>
    <li><a href="Home.html">Home</a></li>
    <li><a href="all_books.html">Books</a></li>
    <li><a href="#">About</a></li>
    </ul>
    </nav>
    
    <div class="profile">
    <a class="profile-icon" href="../HTML/profile.html"><img src=${headImageUrl} alt="profile"></a>
    <button class="login-btn" onclick="location.href='../HTML/Login.html'">Log In</button>
    <button class="signUp-btn" onclick="location.href='../HTML/SignUp.html'">Sign Up</button>
    </div>
    </header>
    
    <div class="msg-box">
    </div>
    
    <div class="scroll-up" id="scroll-up">
    <img src="../img/arrow-up.svg" alt="">
    </div>
    `;

  document.querySelector(".profile-icon img");
  document.write(header);

  let profilePhoto = document.querySelector(".profile-icon img");
  profilePhoto.style.width = "40px";
  profilePhoto.style.height = "40px";
  profilePhoto.style.borderRadius = "50%";
}

function scrollToTop() {
  let scroll_up = document.getElementById("scroll-up");
  window.onscroll = function () {
    if (this.scrollY >= 600) scroll_up.classList.add("show");
    else scroll_up.classList.remove("show");
  };

  scroll_up.onclick = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

function displayLoginSignup() {
  let loginButton = document.querySelector(".login-btn");
  let signUpButton = document.querySelector(".signUp-btn");
  let profileIcon = document.querySelector(".profile-icon");

  if (userId == null) {
    profileIcon.style.display = "none";
  } else {
    loginButton.style.display = "none";
    signUpButton.style.display = "none";
  }
}

function headerProfileImage() {
  let userData = JSON.parse(window.localStorage.getItem("users"));
  if (userId == null) return;
  let curUser = userData[userId];
  headImageUrl = curUser.imageURL;
}

// Shows an animated message
function showMessage(msg, color = "#42bd6c", success = true) {
  let msgBox = document.querySelector(".msg-box");
  let message = document.createElement("div");

  if (success) {
    message.innerHTML = `<span class="material-symbols-rounded"> task_alt </span> ${msg}`;
  } else {
    message.innerHTML = `<span class="material-symbols-rounded"> error </span> ${msg}`;
  }
  message.style.backgroundColor = color;
  message.classList.add("message");

  // Adding to parent
  msgBox.appendChild(message);

  // Showing
  setTimeout(() => message.classList.toggle("active"), 50);
  //   message.classList.toggle("active");

  // Hiding
  setTimeout(() => {
    message.classList.toggle("active");

    // removing
    setTimeout(() => {
      message.remove();
    }, 600);
  }, 3000);
}

//     ---> calling functions <--

headerProfileImage();
displayHeader();
scrollToTop();
displayLoginSignup();
