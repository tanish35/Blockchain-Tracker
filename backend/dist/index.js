"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const corsOptions = {
    origin: [
        "http://localhost:3001",
        "http://0.0.0.0:5173",
        "http://localhost:5173",
        "http://192.168.29.39:5173",
    ],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use("/api/wallet", walletRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
