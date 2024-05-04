# Multifactor Authentication with Vonage

This project demonstrates how to implement multifactor authentication using Vonage's Verify v2 and SIM Swap APIs. The application allows users to verify their identity through a phone number and a PIN code while protecting against SIM swap fraud.

## Features

- **Phone Number Verification**: Users can verify their identity using a phone number and a PIN.
- **SIM Swap Detection**: The application checks if a phone number has been swapped recently.
- **Secure Authentication**: Provides an extra layer of security for user authentication.

## Prerequisites

To run this project, you'll need:

- Node.js (>=14)
- npm or yarn
- A Vonage account with API key, secret, and application ID
- A private key for your Vonage application

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Create a `.env` file in the project root and set the necessary environment variables from `.env.example`

## Usage

1. **Start the server**:

   ```bash
   npm start
   ```

2. **Expose the server using LocalTunnel**:

   Use LocalTunnel to make the server publicly accessible:

   ```bash
   npx localtunnel --port 3000
   ```
