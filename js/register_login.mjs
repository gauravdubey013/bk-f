import { auth, db } from "./firebase.mjs";
import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     window.location.href = "/html/home.html";
//   }
// });

async function register(event) {
  const fullname = document.getElementById("fullname").value;
  const telephone = document.getElementById("telephone").value;
  const email = document.getElementById("Email").value;
  const password = document.getElementById("password").value;
  event.preventDefault();

  try {
    const authData = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await set(ref(db, `users/${authData.user.uid}`), {
      fullname,
      telephone,
      email,
      password,
      role: "user",
    });

    console.log(authData.user);

    wrapper.classList.toggle("active");
    alert("Registration Successful!");
  } catch (error) {
    console.error("Error during registration:", error.message);
    alert(error.code);
  }
}

// login logic here

function login(event) {
  const email = document.getElementById("login_email").value;
  const password = document.getElementById("login_password").value;
  event.preventDefault();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // const user = userCredential.user;
      console.log("Logged in user: ", userCredential.user);
      alert("Login Successful! \nWelcome " + email + " !!");
      window.location.href = "/html/home.html";
    })
    .catch((error) => {
      alert("Login error: Invalid Email or Password", error.message);
    });
}

document
  .getElementById("register_submit")
  .addEventListener("click", function (event) {
    register(event);
  });

document
  .getElementById("login_submit")
  .addEventListener("click", function (event) {
    login(event);
  });

const signInBtnLink = document.querySelector(".signInBtn-link");
const signUpBtnLink = document.querySelector(".signUpBtn-link");
const wrapper = document.querySelector(".wrapper");
signUpBtnLink.addEventListener("click", () => {
  wrapper.classList.toggle("active");
});
signInBtnLink.addEventListener("click", () => {
  wrapper.classList.toggle("active");
});
document.addEventListener("DOMContentLoaded", function () {
  const passwordFields = document.querySelectorAll('input[type="password"]');
  const eyeIcons = document.querySelectorAll(".password-toggle");

  eyeIcons.forEach((eyeIcon, index) => {
    eyeIcon.addEventListener("click", function () {
      const passwordField = passwordFields[index];
      if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("uil-eye");
        eyeIcon.classList.add("uil-eye-slash");
      } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("uil-eye-slash");
        eyeIcon.classList.add("uil-eye");
      }
    });
  });
});
