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
exports.deleteWallet = exports.deleteAllTransactions = exports.getWalletTransactions = exports.updateMonitoring = exports.addWallet = exports.getWallets = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendMail_1 = __importDefault(require("../mail/sendMail"));
const web3_js_1 = require("@solana/web3.js");
const activeConnections = new Map();
const getWallets = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield prisma_1.default.wallet.findMany();
    res.json(wallets);
}));
exports.getWallets = getWallets;
const getWalletTransactions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.body;
    const walletExists = yield prisma_1.default.wallet.findUnique({
        where: { wallet_id: walletId },
    });
    if (!walletExists) {
        yield prisma_1.default.wallet.create({
            data: { wallet_id: walletId, email: "tanishmajumdar2912@gmai.com" },
        });
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const publicKey = new web3_js_1.PublicKey(walletId);
        const signatures = yield connection.getSignaturesForAddress(publicKey, {
            limit: 100,
        });
        if (signatures.length === 0) {
            console.log("No transactions found.");
            return;
        }
        // @ts-ignore
        let transactions1 = [];
        const transactions = yield Promise.all(signatures.map((signature) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const transaction = yield connection.getParsedTransaction(signature.signature, {
                commitment: "confirmed",
                maxSupportedTransactionVersion: 0,
            });
            transactions1.push(transaction);
            const transactionDetails = 
            // @ts-ignore
            ((_b = (_a = transaction.transaction.message.instructions[2]) === null || _a === void 0 ? void 0 : _a.parsed) === null || _b === void 0 ? void 0 : _b.info) || ((_d = (_c = transaction.transaction.message.instructions[0]) === null || _c === void 0 ? void 0 : _c.parsed) === null || _d === void 0 ? void 0 : _d.info);
            const transactionExists = yield prisma_1.default.transaction.findUnique({
                where: { transaction_id: signature.signature },
            });
            if (transactionExists) {
                return {
                    wallet_id: transactionDetails.source,
                    destination_id: transactionDetails.destination,
                    amount: transactionDetails.lamports / web3_js_1.LAMPORTS_PER_SOL,
                };
            }
            yield prisma_1.default.transaction.create({
                data: {
                    transaction_id: signature.signature,
                    wallet_id: transactionDetails.source,
                    destination_id: transactionDetails.destination,
                    amount: transactionDetails.lamports / web3_js_1.LAMPORTS_PER_SOL,
                },
            });
            return {
                wallet_id: transactionDetails.source,
                destination_id: transactionDetails.destination,
                amount: transactionDetails.lamports / web3_js_1.LAMPORTS_PER_SOL,
            };
        })));
        console.log(transactions);
        res.json(transactions);
        return;
    }
    const processedWallets = new Set();
    const transactions = yield recursiveDatabaseQuery(walletId, processedWallets, 0);
    res.json(transactions);
}));
exports.getWalletTransactions = getWalletTransactions;
const recursiveDatabaseQuery = (walletId, processedWallets, level) => __awaiter(void 0, void 0, void 0, function* () {
    if (level > 12 || processedWallets.has(walletId))
        return []; // Base case and prevention of duplicate processing
    processedWallets.add(walletId);
    const transactions = yield prisma_1.default.transaction.findMany({
        where: {
            OR: [{ wallet_id: walletId }, { destination_id: walletId }],
        },
    });
    let allTransactions = [...transactions];
    for (const transaction of transactions) {
        const nextWalletId = transaction.wallet_id === walletId
            ? transaction.destination_id
            : transaction.wallet_id;
        const nextTransactions = yield recursiveDatabaseQuery(nextWalletId, processedWallets, level + 1);
        allTransactions = [...allTransactions, ...nextTransactions];
    }
    return allTransactions;
});
const addWallet = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId, email } = req.body;
    if (!walletId) {
        res.status(400).json({ message: "Wallet ID is required." });
        return;
    }
    const wallet = yield prisma_1.default.wallet.findUnique({
        where: { wallet_id: walletId },
    });
    if (!wallet) {
        yield prisma_1.default.wallet.create({
            data: { wallet_id: walletId, email },
        });
        // @ts-ignore
        updateMonitoring(req, res);
        return;
    }
    res.json({ message: "Wallet added successfully." });
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
            const publicKeyStr = wallet.wallet_id;
            if (!activeConnections.has(publicKeyStr)) {
                const publicKey = new web3_js_1.PublicKey(publicKeyStr);
                connection.onAccountChange(publicKey, (accountInfo) => {
                    console.log("Account data changed:", accountInfo.data);
                    latestTransaction(connection, publicKey);
                });
                activeConnections.set(publicKeyStr, true);
                console.log("Listening for changes to account:", publicKey.toBase58());
            }
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
    var _a, _b, _c, _d, _e;
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
        const transactionDetails = 
        // @ts-ignore
        ((_c = (_b = transaction.transaction.message.instructions[0]) === null || _b === void 0 ? void 0 : _b.parsed) === null || _c === void 0 ? void 0 : _c.info) || ((_e = (_d = transaction.transaction.message.instructions[2]) === null || _d === void 0 ? void 0 : _d.parsed) === null || _e === void 0 ? void 0 : _e.info);
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
        yield prisma_1.default.transaction.create({
            data: {
                transaction_id: latestSignature,
                wallet_id: transactionDetails.source,
                destination_id: transactionDetails.destination,
                amount: transactionDetails.lamports / web3_js_1.LAMPORTS_PER_SOL,
            },
        });
        // @ts-ignore
        addWallet({ body: { walletId: transactionDetails.destination, email: "tanishmajumdar2912@gmail.com" } }, { json: () => { } });
    }
    catch (error) {
        console.error("Error processing transaction:", error);
    }
});
const deleteAllTransactions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.transaction.deleteMany();
    yield prisma_1.default.wallet.deleteMany();
    res.json({ message: "All transactions deleted." });
}));
exports.deleteAllTransactions = deleteAllTransactions;
const deleteWallet = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.body;
    yield prisma_1.default.transaction.deleteMany({
        where: {
            OR: [{ wallet_id: walletId }, { destination_id: walletId }],
        },
    });
    yield prisma_1.default.wallet.delete({
        where: { wallet_id: walletId },
    });
    res.json({ message: "Wallet deleted successfully." });
}));
exports.deleteWallet = deleteWallet;
const addSuspect = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.body;
    const wallet = yield prisma_1.default.wallet.findUnique({
        where: { wallet_id: walletId },
    });
    if (!wallet) {
        yield prisma_1.default.wallet.create({
            data: { wallet_id: walletId, email: "tanishmajumdar2912@gmail.com" },
        });
    }
    const walletExists = yield prisma_1.default.suspicions.findUnique({
        where: { wallet_id: walletId },
    });
    if (!walletExists) {
        yield prisma_1.default.suspicions.create({
            data: { wallet_id: walletId },
        });
        res.json({ message: "Suspect added successfully." });
        return;
    }
    res.json({ message: "Suspect already exists." });
}));
