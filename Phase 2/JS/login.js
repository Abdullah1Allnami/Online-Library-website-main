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


function validUserName(userName)
{
    const usersArr = JSON.parse(window.localStorage.getItem("users"));
    if(usersArr)
    {
        for(let i = 0; i < usersArr.length; ++i)
        {
            if(usersArr[i].userName == userName)
                return true
        }
        return false;
    }
    return false;
}

function validPassword(userName,_password)
{
    const usersArr = JSON.parse(window.localStorage.getItem("users"));
    if(usersArr)
    {
        for(let i = 0; i < usersArr.length; ++i)
        {
            if(usersArr[i].userName == userName && usersArr[i].password == _password)
            {
                window.sessionStorage.setItem("user_id", i);
                window.sessionStorage.setItem("isAdmin", usersArr[i].isAdmin);
                return true;
            }
        }
        return false;
    }
    return false;
}


function validateLogin(){

    let user_name = document.getElementById("user-input").value;
    let user_password = document.getElementById("password-input").value;

    if(validUserName(user_name) == false){
        alert("User name dose not exist");
        return;
    }
    else if (validPassword(user_name,user_password) == false){
        alert("Password or User name is Wrong");
        return;
    }

    window.sessionStorage.setItem("isLogin", true);

}

if(userId != null)
window.location.href= "../HTML/Home.html";

const myForm = document.querySelector(".login-content");
myForm.addEventListener("submit", validateLogin);
// showMessage("Login is succsess");