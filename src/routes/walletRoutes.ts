import express from "express";
import { Request, Response } from "express";

import { getWallets, addWallet, updateMonitoring } from "../controllers/walletController";

const router = express.Router();

router.get("/", getWallets);
router.post("/add", addWallet);
router.post("/monitor", updateMonitoring);

export default router;