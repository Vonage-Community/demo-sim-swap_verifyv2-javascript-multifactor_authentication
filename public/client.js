const phoneForm = document.getElementById("phoneForm");
const pinForm = document.forms[1];
const phoneInput = document.getElementById("phone");
const pinInput = document.getElementById("pin");

var modals = document.querySelectorAll('.modal');

const smsModal = document.getElementById("modalSMS");
const forgotBtn = document.getElementById("forgotButton");

// Shows the modal
forgotBtn.onclick = function() {
  smsModal.style.display = "block";
}

// close modals
var spans = document.getElementsByClassName("close");

// When the user clicks on <span> (x), close the modal
for (var i = 0; i < spans.length; i++) {
 spans[i].onclick = function() {
    for (var index in modals) {
      if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none"; 
    }
 }
}

// Function to send data to the server
function sendData(url, data) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      //feedback.textContent = data.message;
      if (data.message.includes("Verification code sent.")) {
        alert("Verification code sent successfully!");
        phoneForm.style.display = "none";
        pinForm.style.display = "block";
      } else if (data.message === "Success") {
        alert("Authentication successful!");
      }
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again");
    });
}

// Handle phone number form submission
phoneForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const phone = phoneInput.value.trim();
  console.log(phone);
  if (phone) {
    sendData("/verify", { phone });
  } else {
    alert("Please enter a valid phone number.");
  }
});

// Handle PIN form submission
pinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const pin = pinInput.value.trim();
  if (pin) {
    sendData("/login", { pin });
  } else {
    alert("Please enter the verification code.");
  }
});
