import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import * as fs from "fs";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const keypair = Keypair.generate();
  const keypairFile = "keypair4.json";
  fs.writeFileSync(keypairFile, JSON.stringify(Array.from(keypair.secretKey)));
  console.log(`Keypair generated and saved to ${keypairFile}`);
  console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
  const airdropSignature = await connection.requestAirdrop(
    keypair.publicKey,
    2 * LAMPORTS_PER_SOL
  );
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
  console.log("Airdrop completed");
}

main().catch((err) => {
  console.error("Error:", err);
});
