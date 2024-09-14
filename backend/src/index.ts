import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import walletRoutes from "./routes/walletRoutes";

const app = express();
app.use(express.json());

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

app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/wallet", walletRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
