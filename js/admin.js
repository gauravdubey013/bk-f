import { auth, db } from "./firebase.mjs";
import {
  get,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userRef = ref(db, `users/${user.uid}`);

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.role !== "admin") {
            window.location.href = "/html/home.html";
          }
        }
      })
      .catch((error) => {
        console.error("Error retrieving user data:", error);
      });
  } else {
    window.location.href = "/html/home.html";
  }
});

// Fetch users from the database
function fetchUsers() {
  const usersTableBody = document.getElementById("usersTableBody");
  const userCountElement = document.getElementById("userCount");

  const usersRef = ref(db, "users");
  get(usersRef)
    .then((snapshot) => {
      let count = 0;
      snapshot.forEach((userSnapshot) => {
        const userId = userSnapshot.key;
        const userData = userSnapshot.val();

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${userId}</td>
            <td>${userData.email}</td>
            <td>${userData.fullname}</td>
            <td>${userData.telephone}</td>
          `;
        usersTableBody.appendChild(row);
        count++;
      });
      userCountElement.textContent = count;
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

// Function to cancel a booked slot and set its validity to false
window.cancelSlot = function (slotId) {
  const slotRef = ref(db, `booked_slot/${slotId}`);

  // Fetch the existing data of the booked slot
  get(slotRef)
    .then((snapshot) => {
      const slotData = snapshot.val();

      // Update the validity field to false
      slotData.valid = false;

      // Set the modified data back to the database
      set(slotRef, slotData)
        .then(() => {
          console.log("Slot canceled successfully");
          fetchBookedSlots();
        })
        .catch((error) => {
          console.error("Error canceling slot:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching booked slot data:", error);
    });
};

// Fetch booked slots from the database
function fetchBookedSlots() {
  const bookedSlotsTableBody = document.getElementById("bookedSlotsTableBody");
  const slotCountElement = document.getElementById("slotCount");

  const bookedSlotsRef = ref(db, "booked_slot");
  get(bookedSlotsRef)
    .then((snapshot) => {
      let count = 0;
      snapshot.forEach((slotSnapshot) => {
        const slotId = slotSnapshot.key;
        const slotData = slotSnapshot.val();

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${slotId}</td>
            <td>${slotData.email}</td>
            <td>${slotData.selectDate}</td>
            <td>${slotData.selectHour}</td>
            <td>${slotData.selectSlots}</td>
            <td>${slotData.startTime}</td>
            <td>${slotData.endTime}</td>
            <td>${slotData.valid}</td>
            <td>${slotData.vehicleType}</td>
            <td><button onclick="cancelSlot('${slotId}')">Cancel</button></td>
          `;
        bookedSlotsTableBody.appendChild(row);
        count++;
      });
      slotCountElement.textContent = count;
    })
    .catch((error) => {
      console.error("Error fetching booked slots:", error);
    });
}

// Call the functions to fetch and display users and booked slots
fetchUsers();
fetchBookedSlots();
