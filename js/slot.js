import { db } from "./firebase.mjs";
import {
  get,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

var bookedSlotRef = ref(db, "booked_slot");
var boodedSlotData;

get(bookedSlotRef)
  .then((snapshot) => {
    boodedSlotData = snapshot.val();
    // console.log(boodedSlotData);
    markBookedSlots(boodedSlotData);
    updateInvalidSlots(boodedSlotData); // Update invalid slots
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function markBookedSlots(boodedSlotData) {
  // Iterate over each slot in the HTML and check if it's booked
  for (let key in boodedSlotData) {
    const slotNumber = boodedSlotData[key].selectSlots;
    const vehicleType = boodedSlotData[key].vehicleType;
    const isValid = boodedSlotData[key].valid; // Check if the slot is valid

    // Check if the slot number exists and the vehicle type is '2-wheeler' and it's valid
    if (slotNumber && vehicleType === "2-wheeler" && isValid) {
      const slotId = `two-wheeler-slot-${slotNumber}`;
      const slotElement = document.getElementById(slotId);
      if (slotElement) {
        // Add green background color to the booked slot
        slotElement.style.backgroundColor = "green";
      }
    } else if (slotNumber && vehicleType === "4-wheeler" && isValid) {
      const slotId = `four-wheeler-slot-${slotNumber}`;
      const slotElement = document.getElementById(slotId);
      if (slotElement) {
        // Add green background color to the booked slot
        slotElement.style.backgroundColor = "green";
      }
    }
  }
}

function updateInvalidSlots(boodedSlotData) {
  const currentDate = new Date();
  for (let key in boodedSlotData) {
    const selectDate = new Date(boodedSlotData[key].selectDate);
    const selectHour = parseInt(boodedSlotData[key].selectHour);
    const endTime = new Date(boodedSlotData[key].endTime);

    if (
      selectDate < currentDate ||
      (selectDate.getTime() === currentDate.getTime() &&
        selectHour > endTime.getHours())
    ) {
      // Update the 'valid' property to false for the slot
      const slotRef = ref(db, `booked_slot/${key}`);
      update(slotRef, {
        valid: false,
      })
        .then(() => {
          //   console.log(`Slot ${key} is invalid.`);
        })
        .catch((error) => {
          console.error(`Error updating slot ${key}:`, error);
        });
    }
  }
}
