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
exports.updateMonitoring = exports.addWallet = exports.getWallets = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendMail_1 = __importDefault(require("../mail/sendMail"));
const web3_js_1 = require("@solana/web3.js");
const getWallets = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield prisma_1.default.wallet.findMany();
    res.json(wallets);
}));
exports.getWallets = getWallets;
const addWallet = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.body;
    if (!walletId) {
        res.status(400).json({ message: "Wallet ID is required." });
        return;
    }
    const wallet = yield prisma_1.default.wallet.findUnique({
        where: { wallet_id: walletId },
    });
    if (!wallet) {
        yield prisma_1.default.wallet.create({
            data: { wallet_id: walletId },
        });
        // @ts-ignore
        updateMonitoring(req, res);
    }
}));
exports.addWallet = addWallet;
const updateMonitoring = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    try {
        const wallets = yield prisma_1.default.wallet.findMany();
        if (wallets.length === 0) {
            res.status(404).json({ message: "No wallets found to monitor." });
            return;
        }
        wallets.forEach((wallet) => {
            const publicKey = new web3_js_1.PublicKey(wallet.wallet_id);
            connection.onAccountChange(publicKey, (accountInfo) => {
                console.log("Account data changed:", accountInfo.data);
                latestTransaction(connection, publicKey);
            });
            console.log("Listening for changes to account:", publicKey.toBase58());
        });
        res.json({ message: "Monitoring started for all wallets." });
    }
    catch (error) {
        console.error("Error starting monitoring:", error);
        res.status(500).json({ error: "Failed to start monitoring." });
    }
}));
exports.updateMonitoring = updateMonitoring;
const latestTransaction = (connection, publicKey) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const signatures = yield connection.getSignaturesForAddress(publicKey, {
            limit: 1,
        });
        if (signatures.length === 0) {
            console.log("No transactions found.");
            return;
        }
        const latestSignature = (_a = signatures[0]) === null || _a === void 0 ? void 0 : _a.signature;
        const transaction = yield connection.getParsedTransaction(latestSignature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
        });
        if (!transaction) {
            console.log("Transaction not found.");
            return;
        }
        // @ts-ignore
        const transactionDetails = (_c = (_b = transaction.transaction.message.instructions[0]) === null || _b === void 0 ? void 0 : _b.parsed) === null || _c === void 0 ? void 0 : _c.info;
        if (!transactionDetails) {
            console.log("Transaction details are missing.");
            return;
        }
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
        // @ts-ignore
        addWallet({ body: { walletId: transactionDetails.destination } }, { json: () => { } });
    }
    catch (error) {
        console.error("Error processing transaction:", error);
    }
});
