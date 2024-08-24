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
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const publicKey = new web3_js_1.PublicKey("8LJGeKh1eHbPgToEc8m5pjuBTCAyVRFv3yVFDxTWo5PE");
        connection.onAccountChange(publicKey, (accountInfo) => {
            console.log("Account data changed:", accountInfo.data);
        });
        console.log("Listening for changes to account:", publicKey.toBase58());
    });
}
main().catch((err) => {
    console.error("Error:", err);
});
