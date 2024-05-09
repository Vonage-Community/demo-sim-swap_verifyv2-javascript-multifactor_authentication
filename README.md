# Multifactor Security Authentication Using Vonage APIs

## Overview

This project is a web application demonstrating how to strengthen multifactor security authentication using the Vonage SIM Swap API and Verify v2 API. The application includes a simple bank dashboard and a login form. If the SIM Swap API detects that a phone number was swapped recently, the verification code will not be sent, and additional security measures will be applied. A verification code will be sent via the Verify v2 API to authenticate the user if no recent swap is detected.

## Features

- A login form to enter and verify a phone number
- Secure multifactor authentication using Vonage Verify v2
- SIM Swap detection to prevent compromised logins
- Simple bank dashboard after successful login

## Prerequisites

- A Vonage Developer Account
- Node.js and npm installed

## Getting Started

1. Clone the repository and change directories
   ```bash
   git clone https://github.com/Vonage-Community/demo-sim-swap_verifyv2-javascript-multifactor_authentication.git
   cd demo-sim-swap_verifyv2-javascript-multifactor_authentication
   ```
2. Install the required packages:
   ```bash
   npm install
   ```

3. Move the `.env.example` file to `.env` file in the project root and include the following environment variables:
   ```bash
   mv .env.example .env
   ```
   ```bash
   VONAGE_API_KEY=<your-api-key>
   VONAGE_API_SECRET=<your-api-secret>
   VONAGE_APPLICATION_ID=<your-application-id>
   VONAGE_PRIVATE_KEY=<path-to-your-private-key>
   JWT=<jwt-token>
   MSISDN=<phone-number-to-check>
   BRAND_NAME=<your-brand-name>
   RECIPIENT_NUMBER=<number-to-receive-verification>
   ```

5. Run the application:
   ```bash
   node server.js
   ```

5. Launch your web browser and enter the URL:
   ```bash
   http://localhost:3000/
   ```

## How It Works

### SIM Swap API

The application uses the Vonage SIM Swap API to check whether a given phone number has been swapped in the last few days. This protects users from attacks that exploit SIM swaps.

### Verify v2 API

The Verify v2 API sends a one-time code to the user's phone number for authentication. This verification code will be sent if the SIM Swap API determines that the number has not been recently swapped.

### Application Flow

1. The user enters their phone number on the login page.
2. The SIM Swap API checks whether the number was swapped recently.
3. a verification code is sent via the Verify v2 API if no swap is detected.
4. After successful verification, the user can access the bank dashboard.
