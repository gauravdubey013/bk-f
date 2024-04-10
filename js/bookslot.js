import { auth, db } from "./firebase.mjs";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("First Sign in yourself in terms to Book the Slot!");
    window.location.href = "/html/register_login.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Add event listener after DOMContentLoaded
  document
    .getElementById("book_slot_submit")
    .addEventListener("click", function (event) {
      book_slot(event);
    });

  // Set minimum date for selectDate input
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  document.getElementById("selectDate").setAttribute("min", today);
});

async function book_slot(event) {
  event.preventDefault();

  const selectDate = document.getElementById("selectDate").value;
  const startTime = document.getElementById("startTime").value;
  const selectHour = parseInt(document.getElementById("selectHour").value); // Parse the selectHour to integer
  const selectSlots = document.getElementById("selectSlots").value;
  const vehicleType = document.getElementById("vehicleType").value;
  const vehicleNumber = document.getElementById("vehicleNumber").value;

  try {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const authUid = user?.uid;
        const email = user?.email;

        // Parse start time to hours and minutes
        const [startHour, startMinute] = startTime.split(":").map(Number);

        // Calculate end time
        const endHour = (startHour + selectHour) % 24;
        const endTime = `${endHour.toString().padStart(2, "0")}:${startMinute}`;

        // Check if the slot is already booked and valid
        const slotRef = ref(db, `booked_slot/${authUid}`);
        const snapshot = await get(slotRef);
        const existingSlot = snapshot.val();

        if (
          existingSlot &&
          existingSlot.valid &&
          existingSlot.selectSlots === selectSlots &&
          existingSlot.vehicleType === vehicleType
        ) {
          // Slot is already booked and valid for the same slot number and vehicle type
          alert(
            "Slot is already booked and valid. Please choose another slot."
          );
        } else {
          // Book the slot
          await set(slotRef, {
            email,
            vehicleNumber,
            selectDate,
            selectHour,
            selectSlots,
            vehicleType,
            startTime,
            endTime, // Include the calculated endTime
            valid: true, // Always set valid to true initially
          });
          window.location.href = "https://rzp.io/l/j1HoOaw0VO";
          alert("Booked Slot Successfully!\n Please check your email to view the payment receipt.");
          window.location.href = "/html/slot.html";
        }
      }
    });
  } catch (error) {
    console.error("Error during booking:", error.message);
    alert(error.code);
  }
}
