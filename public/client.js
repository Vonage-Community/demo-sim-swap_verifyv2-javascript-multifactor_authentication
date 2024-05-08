const loginForm = document.getElementById("loginForm");
const userInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const phoneForm = document.getElementById("phoneForm");
const pinForm = document.forms[1];
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

var modals = document.querySelectorAll('.modal');

let currentModal = "";

const forgotBtn = document.getElementById("forgotButton");

function closeCurrentModal() {
  currentModal.style.display = "none";
  currentModal = "";
}

function showModal(modal) {
  modal.style.display = "block";
  if (currentModal != "" && currentModal != modal) {
    currentModal.style.display = "none";
  }
  currentModal = modal;
}

forgotBtn.onclick = function() {
  showModal(smsModal)
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

function sendCode() {
  sendData("/sendcode").then((data) => {
    if (data.verifycode) {
      console.log(data);
   } else {
      alert("There was an error sending the SMS code. Please try again later");
      showModal(smsModal)
    }
  });
}

// Function to send data to the server
function sendData(url, data) {
  try {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => { return response.json()})
  } catch (e) {
    console.error(e);
  }
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
      if (data.message != "Success"){
        alert("Invalid verification code. Please try again");
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
  if (newPass == confirmPass) {
    sendData("/update", { newPass }).then((data) => {
      alert("Password successfully updated");
      closeCurrentModal();
    });
  } else {
    alert("Passwords don't match");
  }
});

// Login handler
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = userInput.value.trim();
  const password = passwordInput.value.trim();

  sendData("/login", { username, password }).then((data) => {
    if (data.message != "Ok"){
      alert("Invalid user and password");
    }
  });

});

acceptSwappedBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  showModal(verifyModal);
  sendCode();
});

cancelSwappedBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeCurrentModal();
});
