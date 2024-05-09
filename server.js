require("dotenv").config();
const axios = require("axios");
const express = require("express");
const path = require("path");
const { Auth } = require("@vonage/auth");
const { Vonage } = require("@vonage/server-sdk");
const { Channels } = require("@vonage/verify2");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const vonage = new Vonage(
  new Auth({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
    applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKey: process.env.VONAGE_PRIVATE_KEY,
  })
);

const scope = "dpv:FraudPreventionAndDetection#check-sim-swap";
const authReqUrl = "https://api-eu.vonage.com/oauth2/bc-authorize";
const tokenUrl = "https://api-eu.vonage.com/oauth2/token";
const simSwapApiUrl = "https://api-eu.vonage.com/camara/sim-swap/v040/check";

let verifyRequestId = null;
let pwd = "123"; // Initial password

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// Serve the main.html file
app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, "views/main.html"));
});

// Authenticate function for SIM Swap API
async function authenticate(scope) {
  try {
    const authReqResponse = await axios.post(
      authReqUrl,
      {
        login_hint: process.env.MSISDN,
        scope: scope,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JWT}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const authReqId = authReqResponse.data.auth_req_id;

    const tokenResponse = await axios.post(
      tokenUrl,
      {
        auth_req_id: authReqId,
        grant_type: "urn:openid:params:grant-type:ciba",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JWT}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return tokenResponse.data.access_token;
  } catch (error) {
    console.error(
      "Error during authentication:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Check if the phone number has been recently swapped
async function checkSim(phoneNumber) {
  try {
    const accessToken = await authenticate(scope);
    const response = await axios.post(
      simSwapApiUrl,
      {
        phoneNumber: phoneNumber,
        maxAge: 72,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.swapped;
  } catch (error) {
    console.error(
      "Error checking SIM swap:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Route to send a verification code via Verify2 API using Channels
app.post("/sendcode", async (req, res) => {
  try {
    const response = await vonage.verify2.newRequest({
      brand: process.env.BRAND_NAME,
      workflow: [
        {
          channel: Channels.SMS, // Using SMS as the channel
          to: process.env.RECIPIENT_NUMBER, // Replace with dynamic input if required
        },
      ],
    });
    verifyRequestId = response.requestId;
    res.json({
      message: "Verification code sent.",
      verifycode: true,
      request_id: verifyRequestId,
    });
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ message: "Error processing request.", verifycode: false });
  }
});

// Handle SIM swap check
app.post("/simswap", async (req, res) => {
  const { phone } = req.body;
  try {
    const simSwapped = await checkSim(phone);
    res.json({
      swapped: simSwapped,
    });
  } catch (error) {
    console.error("Error checking SIM swap:", error);
    res.status(500).json({ message: "Error processing request." });
  }
});

// Handle PIN verification
app.post("/verify", (req, res) => {
  const { pin } = req.body;
  vonage.verify2
    .checkCode(verifyRequestId, pin)
    .then((status) => {
      if (status === "completed") {
        res.json({ message: "Success" });
      } else {
        res.json({ message: "Invalid verification code. Please try again." });
      }
    })
    .catch((err) => {
      console.error("Error during PIN verification:", err);
      res.status(500).json({ message: "Error during PIN verification." });
    });
});

// Update password
app.post("/update", (req, res) => {
  const { newPass } = req.body;
  pwd = newPass;
  res.json({ message: "Success" });
});

// Handle login request
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (password === pwd) {
    res.json({ message: "Success" });
  } else {
    res.status(401).json({ message: "Invalid user and password" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
