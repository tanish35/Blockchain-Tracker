"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const router = express_1.default.Router();
router.get("/", walletController_1.getWallets);
router.post("/add", walletController_1.addWallet);
router.get("/monitor", walletController_1.updateMonitoring);
router.post("/transactions", walletController_1.getWalletTransactions);
router.get("/delete", walletController_1.deleteAllTransactions);
router.post("/delete", walletController_1.deleteWallet);
// router.get("/graph", drawGraph);
exports.default = router;
