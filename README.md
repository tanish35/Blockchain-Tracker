# Solana Wallet Manager & Transaction Notifier

This project is a TypeScript-based application that interacts with the Solana blockchain using the Solana Web3.js library. It tracks transactions on the blockchain, creates transaction trails, and clusters them to identify the most connected wallets. The application features wallet creation, SOL token airdrop, transaction tracking, and email notifications for account activities. Additionally, it uses WebSockets for real-time updates and Python code to implement the Louvain algorithm for clustering transactions.

## Features

- **Wallet Creation**: Generates a new Solana wallet and saves the keypair in a JSON file for future use.
- **Airdrop SOL Tokens**: Airdrops 2 SOL to the newly created wallet on the Solana Devnet.
- **Transaction Tracking**: Monitors account changes using WebSockets and retrieves the latest transaction details.
- **Email Notifications**: Sends email alerts with transaction details whenever a change is detected in the monitored accounts.
- **Transaction Clustering**: Uses the Louvain algorithm to cluster transactions and identify the most connected wallets for monitoring.

## Technologies Used

- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **Solana Web3.js**: JavaScript SDK for interacting with the Solana blockchain.
- **ReactFlow**: Library used to visualize blockchain transactions as graphs.
- **Prisma**: ORM used to manage MongoDB.
- **Nodemailer**: Node.js module for sending emails.
- **WebSockets**: Provides real-time event-driven communication.
- **Python**: Used for the Louvain algorithm in the clustering process.

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

3. **Run the Backend Server**

   ```bash
   cd backend
   npm start
   ```

4. **Run the Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

## How It Works

1. **Airdrop & Wallet Management**: The `functions/airdrop.ts` script generates a keypair, saves it to a JSON file, and airdrops 2 SOL to the wallet on the Solana Devnet.

2. **Transaction Tracking**: The `functions/app.ts` script listens for changes to specified accounts using WebSockets. When a change is detected, it fetches the latest transaction details and sends an email notification.

3. **Transaction Clustering**: The `clusters` folder contains Python code implementing the Louvain algorithm. It clusters transactions to identify the most connected wallets.

4. **Wallet Monitoring**: Wallets identified in the most connected cluster are monitored using WebSockets, with email alerts sent for any new transactions.

5. **Make Transaction**: The `functions/transaction.ts` script makes a transaction of 0.01 SOL to a specified wallet.

## Contribution

Feel free to fork the repository and submit pull requests. Contributions, whether bug fixes, features, or documentation improvements, are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
