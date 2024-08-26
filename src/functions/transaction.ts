import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
  TransactionSignature,
} from "@solana/web3.js";
import * as fs from "fs";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const keypairFile = "keypair.json";
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync(keypairFile, "utf8"))
  );
  const payer = Keypair.fromSecretKey(secretKey);

  const recipientPublicKey = new PublicKey(
    "GVYmpv4BCSVj1ffYxYMCYGjjahepcWo4o7rUDC4ipPKD"
  );

  const minRent = await connection.getMinimumBalanceForRentExemption(0);

  const { blockhash } = await connection.getLatestBlockhash();

  const instructions = [
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: recipientPublicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    }),
  ];

  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([payer]);

  // Send the transaction
  const signature: TransactionSignature = await connection.sendTransaction(
    transaction
  );

  // Confirm the transaction
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight: (
      await connection.getLatestBlockhash()
    ).lastValidBlockHeight,
  });

  console.log(`Transaction successful with signature: ${signature}`);
}

main().catch((err) => {
  console.error("Error:", err);
});
