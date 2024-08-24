import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import "dotenv/config";
import sendMail from "./sendMail";

async function latestTransaction(connection: Connection, publicKey: PublicKey) {
  const signatures = await connection.getSignaturesForAddress(publicKey, {
    limit: 1,
  });
  const latestSignature = signatures[0].signature;
  const transaction = await connection.getParsedTransaction(latestSignature, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });
  console.log("Latest transaction:", transaction);
  if (!transaction) {
    return;
  }

  const transactionDetails =
    //@ts-ignore
    transaction.transaction.message.instructions[0].parsed.info;
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
  sendMail(email, htmlContent);
}

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const publicKey = new PublicKey(
    "8LJGeKh1eHbPgToEc8m5pjuBTCAyVRFv3yVFDxTWo5PE"
  );
  connection.onAccountChange(publicKey, (accountInfo) => {
    console.log("Account data changed:", accountInfo.data);
    latestTransaction(connection, publicKey);
  });

  console.log("Listening for changes to account:", publicKey.toBase58());
}

main().catch((err) => {
  console.error("Error:", err);
});
