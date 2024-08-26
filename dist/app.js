"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
require("dotenv/config");
const sendMail_1 = __importDefault(require("./mail/sendMail"));
function latestTransaction(connection, publicKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const signatures = yield connection.getSignaturesForAddress(publicKey, {
            limit: 1,
        });
        const latestSignature = signatures[0].signature;
        const transaction = yield connection.getParsedTransaction(latestSignature, {
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
      <li><strong>Recipient Wallet:</strong> ${transactionDetails.destination}</li>
      <li><strong>Amount Transferred:</strong> ${transactionDetails.lamports / web3_js_1.LAMPORTS_PER_SOL} SOL</li>
    </ul>
    <p>Best regards,<br>Your Blockchain Police</p>
  `;
        const email = "tanishmajumdar2912@gmail.com";
        // @ts-ignore
        (0, sendMail_1.default)(email, htmlContent);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const publicKey = new web3_js_1.PublicKey("8LJGeKh1eHbPgToEc8m5pjuBTCAyVRFv3yVFDxTWo5PE");
        connection.onAccountChange(publicKey, (accountInfo) => {
            console.log("Account data changed:", accountInfo.data);
            latestTransaction(connection, publicKey);
        });
        console.log("Listening for changes to account:", publicKey.toBase58());
    });
}
main().catch((err) => {
    console.error("Error:", err);
});
