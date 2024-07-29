function showDetails(){
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];
    
    document.querySelector("#hello-user-profile").innerHTML = curUser.userName;
    
}

// showDetails();
// document.querySelector("#profile-pic").src = curUser.imageURL;
