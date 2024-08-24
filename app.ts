import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const publicKey = new PublicKey(
    "8LJGeKh1eHbPgToEc8m5pjuBTCAyVRFv3yVFDxTWo5PE"
  );
  connection.onAccountChange(publicKey, (accountInfo) => {
    console.log("Account data changed:", accountInfo.data);
  });

  console.log("Listening for changes to account:", publicKey.toBase58());
}

main().catch((err) => {
  console.error("Error:", err);
});
