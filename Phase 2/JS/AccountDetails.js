// user logged profile image change 
const myImage = document.getElementById("profile-pic");
const uploadInput = document.getElementById("upload-photo");
let remove_photo = document.getElementById("remove-photo-label");

remove_photo.onclick = function(){
    myImage.src = "../img/profile-icon.png";
    saveImage(myImage.src);
}

uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            myImage.src = e.target.result;
            myImage.style.borderRadius  = 35 + "px";
            saveImage(myImage.src);
        };
        reader.readAsDataURL(file);
    }
});

function resetImage() {
    myImage.src = "../img/profile-icon.png";
    saveImage(myImage.src);
}

function saveImage(_image_url_){
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];
    curUser.imageURL = _image_url_;

    userData[userId] = curUser;
    userData = JSON.stringify(userData);
    window.localStorage.setItem("users", userData);
}

// -----------------------------------------------


function showDetails(){
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];
    
    document.querySelector("#hello-user").innerHTML = curUser.userName;
    document.querySelector("#user-email-input").value = curUser.email;
    
    if (curUser.firstName){
        document.querySelector("#first-name-input").value = curUser.firstName;
    } 
    if (curUser.lastName) {
        document.querySelector("#second-name-input").value = curUser.lastName;
    }
    if (curUser.phoneNumber) {
        document.querySelector("#phone-number-input").value = curUser.phoneNumber;
    }

    if (curUser.imageURL) {
        document.querySelector("#profile-pic").src = curUser.imageURL;
    }
}


function saveChanges()
{
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];

    let password = document.querySelector("#current-password-input").value;
    let New_password_1 = document.querySelector("#new-password-1").value;
    let New_password_2 = document.querySelector("#new-password-2").value;
    
    
    // work only if the user want to change the password
    if ((New_password_1.trim() !== "") && (New_password_1 === New_password_2)) {
        if (password.trim() !== curUser.password) {
            alert("your current password is incorrect");
            return false;
        } else{
            curUser.password = New_password_1;    
        }
    }
    
    let _firstName_ = document.querySelector("#first-name-input").value.trim(); 
    let _lastName_ = document.querySelector("#second-name-input").value.trim();
    let _phoneNumber_ = document.querySelector("#phone-number-input").value.trim();
    curUser.firstName = _firstName_;
    curUser.lastName = _lastName_;
    curUser.phoneNumber = _phoneNumber_;


    if ((curUser.firstName && _firstName_.trim() !== "") || (!curUser.firstName && _firstName_.trim() !== "")) {
        curUser.firstName = _firstName_;
    } 
    if ((curUser.lastName && _lastName_.trim() !== "") || (!curUser.lastName && _lastName_.trim() !== "")) {
        curUser.lastName = _lastName_;
    }
    if ((curUser.phoneNumber && _phoneNumber_.trim() !== "") || (!curUser.phoneNumber && _phoneNumber_.trim() !== "")) {
        curUser.phoneNumber = _phoneNumber_;
    }
    
    userData[userId] = curUser;
    userData = JSON.stringify(userData);
    window.localStorage.setItem("users", userData);
}

showDetails();
let myForm = document.querySelector(".edit-user-info");
myForm.addEventListener("submit", saveChanges);
