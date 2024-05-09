// Get relevant form elements
const loginForm = document.getElementById("loginForm");
const userInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const phoneForm = document.getElementById("phoneForm");
const pinForm = document.getElementById("pinForm");
const phoneInput = document.getElementById("phone");
const pinInput = document.getElementById("pin");

const passInput = document.getElementById("pass1");
const passReInput = document.getElementById("pass2");

const updatePassForm = document.getElementById("changePwdForm");
const confirmSwappedForm = document.getElementById("confirmSwapForm");

const smsModal = document.getElementById("modalSMS");
const swappedModal = document.getElementById("modalSwapped");
const verifyModal = document.getElementById("modalVerification");
const changePassModal = document.getElementById("modalNewPassword");

const acceptSwappedBtn = document.getElementById("accept_swapped");
const cancelSwappedBtn = document.getElementById("cancel_swapped");

const forgotBtn = document.getElementById("forgotButton");

let currentModal = "";

// Function to close the current modal
function closeCurrentModal() {
  if (currentModal) {
    currentModal.style.display = "none";
    currentModal = "";
  }
}

// Function to show a specific modal
function showModal(modal) {
  modal.style.display = "block";
  if (currentModal && currentModal !== modal) {
    currentModal.style.display = "none";
  }
  currentModal = modal;
}

forgotBtn.onclick = function () {
  showModal(smsModal);
};

// Close modals when clicking on close button
const spans = document.getElementsByClassName("close");
for (let i = 0; i < spans.length; i++) {
  spans[i].onclick = function () {
    closeCurrentModal();
  };
}

// Function to send data to the server
async function sendData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error during data request to ${url}:`, error);
    alert("An error occurred while communicating with the server.");
  }
}

// Function to send a verification code
function sendCode() {
  sendData("/sendcode", {}).then((data) => {
    if (data && data.verifycode) {
      console.log("Verification code sent successfully:", data);
    } else {
      alert("There was an error sending the verification code. Please try again later.");
    }
  }).catch((error) => {
    console.error("Error during verification code sending:", error);
    alert("An error occurred while trying to send the verification code.");
  });
}

// Handle phone number form submission
phoneForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const phone = phoneInput.value.trim();
  if (phone) {
    sendData("/simswap", { phone }).then((data) => {
      if (data.swapped) {
        showModal(swappedModal);
      } else {
        showModal(verifyModal);
        sendCode();
      }
    });
  } else {
    alert("Please enter a valid phone number.");
  }
});

// Handle PIN form submission
pinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const pin = pinInput.value.trim();
  if (pin) {
    sendData("/verify", { pin }).then((data) => {
      if (data.message !== "Success") {
        alert("Invalid verification code. Please try again.");
      } else {
        showModal(changePassModal);
      }
    });
  } else {
    alert("Please enter the verification code.");
  }
});

// Handle Change of Password
updatePassForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newPass = passInput.value.trim();
  const confirmPass = passReInput.value.trim();
  if (newPass === confirmPass) {
    sendData("/update", { newPass }).then((data) => {
      if (data.message === "Success") {
        alert("Password successfully updated.");
        closeCurrentModal();
      }
    });
  } else {
    alert("Passwords don't match.");
  }
});

// Login handler
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = userInput.value.trim();
  const password = passwordInput.value.trim();

  sendData("/login", { username, password })
    .then((data) => {
      if (data.message !== "Success") {
        alert("Invalid user and password.");
      } else {
        // Redirect to the /main page
        window.location.href = "/main";
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    });
});

// Handle acceptance of swapped SIM card
acceptSwappedBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showModal(verifyModal);
  sendCode();
});

// Handle cancellation of swapped SIM card
cancelSwappedBtn.addEventListener("click", (event) => {
  event.preventDefault();
  closeCurrentModal();
});
