// user logged profile image change 
// const myImage = document.getElementById("profile-pic");
// const uploadInput = document.getElementById("upload-photo");
// let remove_photo = document.querySelector(".remove-photo-label");

// console.log(myImage);

// console.log("Account details");


// remove_photo.onclick = ()=>{
//     myImage.src = "../img/profile-icon.png";
// }

// uploadInput.addEventListener("change", (event) => {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             myImage.src = e.target.result;
//             myImage.style.borderRadius  = 35 + "px";
//             saveImage(myImage.src);
//         };
//         reader.readAsDataURL(file);
//     }
// });

// function resetImage() {
//     myImage.src = "../img/profile-icon.png";
//     saveImage(myImage.src);
// }

// -----------------------------------------------


let savedUserData = null;

document.addEventListener("DOMContentLoaded", function () {
  const curUser = window.localStorage.getItem("user_id");
  const apiEndpoint = `http://127.0.0.1:8000/api.users/${curUser}/`; // Replace with the actual endpoint

  // Function to fetch user data and populate the form fields using XMLHttpRequest
  function populateUserData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiEndpoint, true);
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const data = xhr.response;
        savedUserData = data;
        document.getElementById("first-name-input").value =
          data.firstName || "";
        document.getElementById("second-name-input").value =
          data.secondName || "";
        document.getElementById("user-email-input").value = data.email;
        document.getElementById("phone-number-input").value =
          data.phoneNumber || "";
      }
    };
    xhr.send();
  }

  // Call the function to populate user data
  populateUserData();

  document
    .querySelector(".edit-user-info")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission

      const currentPassword = document.getElementById("current-password-input");
      const newPassword1 = document.getElementById("new-password-1").value;
      const newPassword2 = document.getElementById("new-password-2").value;
      const email = document.getElementById("user-email-input").value;
      const fName = document.getElementById("first-name-input").value;
      const sName = document.getElementById("second-name-input").value;
      if (!email) {
        showMessage("Email is Required", "red", false);
        return;
      }
      if (!fName) {
        showMessage("First Name is Required", "red", false);
        return;
      }
      if (!sName) {
        showMessage("Second Name is Required", "red", false);
        return;
      }
      if (!newPassword1 && currentPassword.value) {
        showMessage("New Password Cant be empty", "red", false);
        return;
      }
      if (
        currentPassword.value.length &&
        currentPassword.value !== savedUserData.password
      ) {
        showMessage("Typed Current Password is Wrong", "red", false);
        return;
      }

      if (currentPassword.value.length && newPassword1 !== newPassword2) {
        showMessage(
          "New Password Typed and the Confirmation Does Not Match",
          "red",
          false
        );
        return;
      }
      var updatedData;
      if (newPassword1 || currentPassword.value) {
        updatedData = {
          firstName: document.getElementById("first-name-input").value,
          secondName: document.getElementById("second-name-input").value,
          email: document.getElementById("user-email-input").value,
          phoneNumber: document.getElementById("phone-number-input").value,
          password: newPassword1,
        };
      } else {
        updatedData = {
          firstName: document.getElementById("first-name-input").value,
          secondName: document.getElementById("second-name-input").value,
          email: document.getElementById("user-email-input").value,
          phoneNumber: document.getElementById("phone-number-input").value,
        };
      }
      // If validation passes, prepare the data and send a PUT request

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", apiEndpoint, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            showMessage("User Data Edited Successfully");
          } else {
            showMessage("Error changing user data", "red", false);
          }
        }
      };
      xhr.send(JSON.stringify(updatedData));
    });
});