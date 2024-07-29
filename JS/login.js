let open_eye = document.getElementById("open-eye");
let close_eye = document.getElementById("close-eye");
let password = document.getElementById("password-input");
const myForm = document.querySelector(".login-content");
let login_button = document.querySelector(".login-button");

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


function validUserName(userName)
{
    if(userName.trim() === ""){
        showMessage("User name is required", "red", false);
        return false;
    }

    let request = new XMLHttpRequest();
    request.open("GET",`http://127.0.0.1:8000/api.users/`);
    request.send();
    request.onload = () =>{
        let data = JSON.parse(request.responseText);
        let found = false;
        for(const user of data){
            if(user["username"] == userName)
                found = true;
        }

        if(found == false){
            showMessage("User name is not found", "red", false);
            return false;
        }
    }

    return true;
}

function validPassword(userName,_password)
{
    if(_password.trim() === ""){
        showMessage("Password is required", "red", false);
        return false;
    }

    let request = new XMLHttpRequest();
    request.open("GET",`http://127.0.0.1:8000/api.users/`);
    request.send();
    request.onload = () =>{
        let data = JSON.parse(request.responseText);
        let found = false;
        for(const user of data){
            if(user["username"] == userName && user["password"] == _password)
                found = true;
        }

        if(found == false){
            showMessage("User name or password is Wrong", "red", false);
            return false;
        }
    }

    return true;
}


function validateLogin(){

    let user_name = document.getElementById("user-input").value;
    let user_password = document.getElementById("password-input").value;

    let request = new XMLHttpRequest();
    request.open("GET",`http://127.0.0.1:8000/api.users/`);
    request.send();
    for(let i = 0; i < 1000; ++i)
        console.log("aaaaa");
    request.onload = () =>{
        let data = JSON.parse(request.responseText);
        for(let i = 0; i < 1000; ++i)
            console.log("aaaaa");
        for(let i = 0; i < data.length; ++i){
            if(user_name == data["username"] && user_password == data["password"]){
                window.localStorage.setItem("user_id", data["id"]);
                window.localStorage.setItem("isAdmin", data["isAdmin"]);
                window.localStorage.setItem("isLogin", true);
            }
        }
    }
    request.onerror = ()=>{
        
        for(let i = 0; i < 1000; ++i)
            console.log("aaaaa");
    }



}

login_button.onclick = () =>{
    let user_name = document.getElementById("user-input").value;
    let user_password = document.getElementById("password-input").value;
    let validation = true;
    
    if(validUserName(user_name) == false)
        validation = false;
    if(validPassword(user_name, user_password) == false)
        validation = false;

    console.log(validation);

    if(validation == false)
        return;

    let request = new XMLHttpRequest();
    request.open("GET",`http://127.0.0.1:8000/api.users/`);
    request.send();
    request.onload = () =>{
        let data = JSON.parse(request.responseText);
        console.log(data);
        for(const user of data){
            if(user_name == user["username"] && user_password == user["password"]){
                window.localStorage.setItem("user_id", user["id"]);
                window.localStorage.setItem("isAdmin", user["isAdmin"]);
                window.localStorage.setItem("isLogin", true);
                location.reload();
            }
        }
    }
}


// console.log(userId);
if(userId != null)
    window.location.href= "../HTML/Home.html";