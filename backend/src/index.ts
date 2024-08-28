import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import walletRoutes from "./routes/walletRoutes";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:5173",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/wallet", walletRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

