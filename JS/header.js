let userId = JSON.parse(window.localStorage.getItem("user_id"));


async function getPHOTO(photoID) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/photo/${photoID}/`, {
      method: "GET",
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const photoDisplay = document.querySelector(".profile .profile-icon")
      photoDisplay.innerHTML = `<img src="${url}" alt="profile picture" width="40" height="40" style="border-radius: 50%;"/>`;
    } else {
      console.error("Photo not found");
    }
  } catch (error) {
    console.error("Error fetching photo:", error);
  }
}

async function fetchUserPhoto(userId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api.users/${userId}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();
    getPHOTO(userData.photo);


  } catch (error) {
    console.error('Error fetching user photo:', error);
    throw error;
  }
}

function displayHeader(userImage) {
  if(userImage == null)
      userImage = `photo_default.png`;
  let header = `
    <link rel="shortcut icon" type="x-icon" href="../img/ICON.png">
    <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
        <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
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
    <li><a href="about.html">About</a></li>
    </ul>
    </nav>
    
    <div class="profile">
      <a class="profile-icon" href="../HTML/profile.html">  </a>
      <button class="login-btn" onclick="location.href='../HTML/Login.html'">Log In</button>
      <button class="signUp-btn" onclick="location.href='../HTML/SignUp.html'">Sign Up</button>
    </div>
    </header>
    
    <div class="msg-box">
    </div>

    <div class="modal-container">
      <div class="modal">
        <div class="header">
          </div>
          <div class="body">
        </div>
        <div class="modal-warning" id="modal-warning">
          <h4>⚠ Warning</h4>
          <p>
          </p>
        </div>
        <div class="footer">
          <button class="yes-button" id="modal-yes">Yes</button>
          <button class="no-button" id="modal-no">No</button>
        </div>
      </div>
    </div>
    
    <div class="scroll-up" id="scroll-up">
      <img src="../img/arrow-up.svg" alt="">
    </div>
    `;

  document.write(header);
}

function scrollToTop() {
  let scroll_up = document.getElementById("scroll-up");
  window.onscroll = function () {
    if (this.scrollY >= 600) 
      scroll_up.classList.add("show");
    else 
      scroll_up.classList.remove("show");
  };

  scroll_up.onclick = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

function headerProfileImage() {
  let request = new XMLHttpRequest();
  request.open("GET", `http://127.0.0.1:8000/api.users/${userId}/`);
  request.send();
  request.onload = () => {
    let data = JSON.parse(request.responseText);
    headImageUrl = "";
    headImageUrl = data["photo"];
  }
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

// ------- Modal
const closeModal = () => {
  // Container
  const container = document.querySelector(".modal-container");
  const modal = document.querySelector(".modal-container .modal");
  container.classList.toggle("fade-out");

  // modal
  modal.classList.toggle("fade-down");
  setTimeout(() => {
    container.style.display = 'none';
  }, 400);
}

const openModal = (title, bodyText, options) => {
  /* 
      parameters: 
      ->  title
      ->  bodyText
      ->  options: {
              warning: text,
              actionButton: function
              actionButtonText: text
              closeButtonText: text
          }
  */

  // Main accessors
  const container = document.querySelector(".modal-container");
  const modal = document.querySelector(".modal-container .modal");
  const closeBtn = modal.querySelector(".footer .no-button");

  // title and text and close button
  modal.querySelector(".header").textContent = title;
  modal.querySelector(".body").textContent = bodyText;
  closeBtn.onclick = (e) => closeModal();

  // options
  if (options) {
    if (options.warning) {
      modal.querySelector(".modal-warning").style.display = 'block';
      modal.querySelector(".modal-warning p").textContent = options.warning;
    }

    if (options.actionButton) {
      const actionBtn = modal.querySelector(".footer .yes-button");
      actionBtn.style.display = 'block';
      actionBtn.onclick = () => {
        options.actionButton();
        closeModal();
      };
      if (options.actionButtonText) {
        actionBtn.textContent = options.actionButtonText;
      }
    }

    if (options.closeButtonText) {
      closeBtn.textContent = options.closeButtonText;
    }
  }

  // Finally show up
  container.style.display = 'flex';
  setTimeout(() => {
    container.classList.toggle("fade-out")
    // modal
    modal.classList.toggle("fade-down");
  }, 10);

}



//     ---> calling functions <--
displayHeader();
fetchUserPhoto(userId);
scrollToTop();
displayLoginSignup();