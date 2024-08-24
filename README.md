# Solana Wallet Manager & Transaction Notifier

This project is a TypeScript-based application that interacts with the Solana blockchain using the Solana Web3.js library. The application has several key functionalities, including wallet creation, SOL token airdrop, transaction tracking, and email notifications upon account changes. WebSockets are used to listen for real-time updates on the Solana blockchain.

## Features

- **Wallet Creation**: Generates a new Solana wallet and saves the keypair in a JSON file for future use.
- **Airdrop SOL Tokens**: Airdrops 2 SOL to the newly created wallet on the Solana Devnet.
- **Transaction Tracking**: Monitors any changes to the account using WebSockets and retrieves the latest transaction details.
- **Email Notifications**: Sends an email notification with transaction details whenever a change is detected in the account.

## Technologies Used

- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **Solana Web3.js**: JavaScript SDK for interacting with the Solana blockchain.
- **Nodemailer**: Node.js module for sending emails.
- **WebSockets**: Provides real-time event-driven communication.

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/tanish35/Blockchain-Tracker.git
   cd solana-wallet-manager
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   npm start
   ```

## How It Works

1. **Airdrop & Wallet Management**: The `airdrop.ts` script generates a keypair, saves it to a JSON file, and airdrops 2 SOL to the wallet on the Solana Devnet.

2. **Transaction Tracking**: The `app.ts` script listens for changes to a specified account using WebSockets. When a change is detected, it fetches the latest transaction details and sends an email notification with the information.

3. **Email Notifications**: The Nodemailer library is used to send emails with transaction details, making sure you stay updated on all account activities.

4. **Make Transaction**: The `transaction.ts` script makes a transaction of 0.01 SOL to your desired wallet

## Contribution

Feel free to fork the repository and submit pull requests. Contributions, whether bug fixes, features, or documentation improvements, are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README provides a comprehensive overview of your project, explaining its purpose, functionality, and setup instructions.
