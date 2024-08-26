import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";
import sendMail from "../mail/sendMail";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";

const activeConnections: Map<string, boolean> = new Map();

const getWallets = asyncHandler(async (req: Request, res: Response) => {
  const wallets = await prisma.wallet.findMany();
  res.json(wallets);
});

const addWallet = asyncHandler(async (req: Request, res: Response) => {
  const { walletId } = req.body;
  if (!walletId) {
    res.status(400).json({ message: "Wallet ID is required." });
    return;
  }
  const wallet = await prisma.wallet.findUnique({
    where: { wallet_id: walletId },
  });
  if (!wallet) {
    await prisma.wallet.create({
      data: { wallet_id: walletId },
    });
    // @ts-ignore
    updateMonitoring(req, res);
    return;
  }
  res.json({ message: "Wallet added successfully." });
});

const updateMonitoring = asyncHandler(async (req: Request, res: Response) => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  try {
    const wallets = await prisma.wallet.findMany();
    if (wallets.length === 0) {
      res.status(404).json({ message: "No wallets found to monitor." });
      return;
    }
    wallets.forEach((wallet) => {
      const publicKeyStr = wallet.wallet_id;
      if (!activeConnections.has(publicKeyStr)) {
        const publicKey = new PublicKey(publicKeyStr);
        connection.onAccountChange(publicKey, (accountInfo) => {
          console.log("Account data changed:", accountInfo.data);
          latestTransaction(connection, publicKey);
        });
        activeConnections.set(publicKeyStr, true);
        console.log("Listening for changes to account:", publicKey.toBase58());
      }
    });

    res.json({ message: "Monitoring started for all wallets." });
  } catch (error) {
    console.error("Error starting monitoring:", error);
    res.status(500).json({ error: "Failed to start monitoring." });
  }
});

const latestTransaction = async (
  connection: Connection,
  publicKey: PublicKey
) => {
  try {
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: 1,
    });

    if (signatures.length === 0) {
      console.log("No transactions found.");
      return;
    }

    const latestSignature = signatures[0]?.signature;

    const transaction = await connection.getParsedTransaction(latestSignature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction) {
      console.log("Transaction not found.");
      return;
    }
    const transactionDetails =
      // @ts-ignore
      transaction.transaction.message.instructions[0]?.parsed?.info;

    if (!transactionDetails) {
      console.log("Transaction details are missing.");
      return;
    }

    const htmlContent = `
      <p>Dear User,</p>
      <p>A transaction has been completed on the Solana blockchain:</p>
      <ul>
        <li><strong>Sender Wallet:</strong> ${transactionDetails.source}</li>
        <li><strong>Recipient Wallet:</strong> ${
          transactionDetails.destination
        }</li>
        <li><strong>Amount Transferred:</strong> ${
          transactionDetails.lamports / LAMPORTS_PER_SOL
        } SOL</li>
      </ul>
      <p>Best regards,<br>Your Blockchain Police</p>
    `;

    const email = "tanishmajumdar2912@gmail.com";
    // @ts-ignore
    sendMail(email, htmlContent);
    // @ts-ignore
    addWallet(
      { body: { walletId: transactionDetails.destination } },
      { json: () => {} }
    );
  } catch (error) {
    console.error("Error processing transaction:", error);
  }
};

export { getWallets, addWallet, updateMonitoring };
