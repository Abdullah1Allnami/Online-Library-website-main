function AccountDetailsClick() {
    window.location.href = "AccountDetails.html";
  }

  function OrdersClick() {
    window.location.href = "orders.html";
  }

  function AddressesClick() {
    window.location.href = "addresses.html";
  }

  function PaymentClick() {
    window.location.href = "paymentDetails.html";
  }

  function SignOutClick() {
    sessionStorage.clear();
    // window.location.href = "login.html";
  }

  function addSideBar(){
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];

    let sideBar =
    `
    <div class="sidebar">
          
    <div class="profile-info">
      <img src= ${curUser.imageURL} alt="placeholder" id="profile-pic">
      <div>Hello <span id="hello-user" style="color: black;">${curUser.userName}</span> </div>
    </div>
    
    <div class="change-photo">
      <form class=""> 
        <input id="upload-photo" type="file"  accept="image/*">
        <label class="upload-photo-label"  for="upload-photo"><i class="fa-solid fa-upload"></i> Upload</label>
      </form>
      <span class="remove-photo-label" id = "remove-photo-label" ></i> Remove</span>
    </div>
    
    <ul class="profile-options-list">
      <li class="ProfileDetails" onclick="AccountDetailsClick()"><a href="AccountDetails.html">
        <i class="fa-solid fa-address-book"></i>
        Account Details
      </a></li>
      <li class="profileOrders"onclick="OrdersClick()"><a href="orders.html">
        <i class="fa-solid fa-list"></i>
        Your Books
      </a></li>
      <li class="ProfileFavorite"><a href="favourites.html">
        <i class="fa-solid fa-heart"></i>
        Favorite
      </a></li>
      <li class="SignOut"  style="border-bottom: none;" onclick="SignOutClick()"><a href="Login.html">
        <i class="fa-solid fa-right-from-bracket"></i>
        Sign Out
      </a></li>
    </ul>
    </div>
    ` 

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(sideBar, "text/html");

    let content = document.querySelector(".content");
    content.append(parsedDocument.querySelector(".sidebar"));
}

addSideBar();