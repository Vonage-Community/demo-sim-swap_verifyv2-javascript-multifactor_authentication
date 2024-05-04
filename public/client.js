const phoneForm = document.getElementById("loginForm");
const pinForm = document.forms[1];
const phoneInput = document.getElementById("phone");
const pinInput = document.getElementById("pin");
const feedback = document.getElementById("feedback");

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
      feedback.textContent = data.message;
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
      feedback.textContent = "An error occurred. Please try again.";
    });
}

// Handle phone number form submission
phoneForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const phone = phoneInput.value.trim();
  if (phone) {
    sendData("/verify", { phone });
  } else {
    feedback.textContent = "Please enter a valid phone number.";
  }
});

// Handle PIN form submission
pinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const pin = pinInput.value.trim();
  if (pin) {
    sendData("/login", { pin });
  } else {
    feedback.textContent = "Please enter the verification code.";
  }
});
