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
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const transporter = nodemailer_1.default.createTransport({
    // @ts-ignore
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD,
    },
});
const sendMail = (0, express_async_handler_1.default)((email, url) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: '"Blockchain Police" <alerts@blockchain.com>',
        // @ts-ignore
        to: email,
        subject: "Alert for wallet changes",
        text: "Wallet Change",
        // @ts-ignore
        html: url,
    });
}));
exports.default = sendMail;
