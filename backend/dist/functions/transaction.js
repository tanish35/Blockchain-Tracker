"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const fs = __importStar(require("fs"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const keypairFile = "keypair3.json";
        const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(keypairFile, "utf8")));
        const payer = web3_js_1.Keypair.fromSecretKey(secretKey);
        const recipientPublicKey = new web3_js_1.PublicKey("HvNYXNSCv3PEaLNgttPdLs2kPBM6dt6Gkfs8TGuSL8Gq");
        const minRent = yield connection.getMinimumBalanceForRentExemption(0);
        const { blockhash } = yield connection.getLatestBlockhash();
        const instructions = [
            web3_js_1.SystemProgram.transfer({
                fromPubkey: payer.publicKey,
                toPubkey: recipientPublicKey,
                lamports: 0.01 * web3_js_1.LAMPORTS_PER_SOL,
            }),
        ];
        const messageV0 = new web3_js_1.TransactionMessage({
            payerKey: payer.publicKey,
            recentBlockhash: blockhash,
            instructions,
        }).compileToV0Message();
        const transaction = new web3_js_1.VersionedTransaction(messageV0);
        transaction.sign([payer]);
        // Send the transaction
        const signature = yield connection.sendTransaction(transaction);
        // Confirm the transaction
        yield connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight: (yield connection.getLatestBlockhash()).lastValidBlockHeight,
        });
        console.log(`Transaction successful with signature: ${signature}`);
    });
}
main().catch((err) => {
    console.error("Error:", err);
});
