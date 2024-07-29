let open_eye = document.getElementById("open-eye");
let close_eye = document.getElementById("close-eye");
let password = document.getElementById("password-input");

open_eye.onclick = close_eye.onclick = function()
{
    if(password.type == "password")
    {
        password.type = "text"
        open_eye.style.display = "flex";
        close_eye.style.display = "none";
        
    }
    else
    {
        password.type = "password";
        open_eye.style.display = "none";
        close_eye.style.display = "flex";
    }
}

let user = document.getElementById("user");
let admin = document.getElementById("admin");

user.onclick = function(){
    user.classList.add("type-active");
    admin.classList.remove("type-active");
}

admin.onclick = function(){
    admin.classList.add("type-active");
    user.classList.remove("type-active");
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

function ValidUserName(userName){
    if(userName.trim() === "")
    {
        alert("User name is required");
        return false;
    }

    const usersArr = JSON.parse(window.localStorage.getItem("users"));
    if(usersArr)
    {
        for(let i = 0; i < usersArr.length; ++i)
        {
            if (userName == usersArr[i].userName)
            {
                alert("User name already exist");
                return false;
            }
        }
    }
    return true;
}

function ValidPassword(password){
    if(password.trim() === "")
    {
        alert("Password is required");
        return false;
    }
}

function ValidEmail(email)
{
    // var pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    // if(email.match(pattern) == false){
    //     alert("email is not valid")
    //     return false;
    // }
    if(email.trim() == "")
    {
        alert("Email is requird");
        return false;
    }
    else if (email.includes("@") == false)
    {
        alert("Email is invalid");
        return;
    }
}


function addNewUser(){
    let userType = false;
    if (admin.className === "admin type-active")
        userType = true;

    let userName = document.getElementById("user-input").value;
    let userPassword = document.getElementById("password-input").value;
    let confirmPassword = document.getElementById("confirm-input").value;
    let userEmail = document.getElementById("email-input").value;


    let newUser = new User(
        userName,
        userPassword,
        userEmail,
        userType,
        "",
        "",
        "../img/profile-icon.png",
        [],
        [],
        ""
    );

    if(ValidUserName(userName) == false)
        return;
    else if(ValidPassword(userPassword) == false)
        return;
    else if(confirmPassword.trim() === "")
    {
        alert("Confirm password is required");
        return;
    }    
    else if (confirmPassword != userPassword)
    {
        alert("Password or confirm password is wrong");
        return;
    }

    else if(ValidEmail(userEmail) == false)
        return;

    
    let usersJSON = window.localStorage.getItem("users");
    let updatedJSON, usersArr;

    if (usersJSON) {
        usersArr = JSON.parse(usersJSON);
        usersArr.push(newUser);
        updatedJSON = JSON.stringify(usersArr);
    } else {
        updatedJSON = JSON.stringify([newUser]);
    }
    window.localStorage.setItem("users", updatedJSON);
    
    
    let users= JSON.parse(window.localStorage.getItem("users"));
    if(users != null){
        window.sessionStorage.setItem("user_id", users.length-1)
        window.sessionStorage.setItem("isAdmin", users[users.length-1].isAdmin)
    }

    window.sessionStorage.setItem("isSignUp", true);



    
}

const myForm = document.querySelector(".signup-content");
myForm.addEventListener("submit", addNewUser);

if(userId != null)
    window.location.href= "../HTML/Home.html"; 