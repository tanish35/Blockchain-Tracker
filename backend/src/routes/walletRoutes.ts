import express from "express";
import { Request, Response } from "express";

import {
  getWallets,
  addWallet,
  updateMonitoring,
  getWalletTransactions,
  deleteAllTransactions,
  deleteWallet,
} from "../controllers/walletController";

const router = express.Router();

router.get("/", getWallets);
router.post("/add", addWallet);
router.get("/monitor", updateMonitoring);
router.post("/transactions", getWalletTransactions);
router.get("/delete", deleteAllTransactions);
router.post("/delete", deleteWallet);
// router.get("/graph", drawGraph);

export default router;
