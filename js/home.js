import { auth, db } from "./firebase.mjs";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const signInLink = document.querySelector(".signin");
const logOutLink = document.querySelector(".logout");

// Function to handle logout
const handleLogout = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};

// Add event listener to log out link
logOutLink.addEventListener("click", handleLogout);

// Check user authentication state
onAuthStateChanged(auth, async (user) => {
  const adminButton = document.querySelector(".admin");
  if (user) {
    console.log("User is logged in");
    signInLink.style.display = "none";
    logOutLink.style.display = "block";

    const userRef = ref(db, `users/${user.uid}`);

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          // console.log(userData);
          // Check if the user's role is admin
          if (userData.role === "admin") {
            adminButton.style.display = "block";
          } else {
            adminButton.style.display = "none";
          }
        }
      })
      .catch((error) => {
        console.error("Error retrieving user data:", error);
      });
  } else {
    console.log("User is logged out");
    signInLink.style.display = "block";
    logOutLink.style.display = "none";
    adminButton.style.display = "none";
  }
});
