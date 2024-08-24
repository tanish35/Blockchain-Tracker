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
  const keypairFile = "keypair1.json";
  fs.writeFileSync(keypairFile, JSON.stringify(Array.from(keypair.secretKey)));
  console.log(`Keypair generated and saved to ${keypairFile}`);
  console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
}

main().catch((err) => {
  console.error("Error:", err);
});
