import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/shopping", (_req,res) => {
  res.json({ ok: true, message: "Bianca e Fábio Shopping API" })
});

app.use("/products", productRoutes);

app.use("/auth", authRoutes);

app.use("/orders", orderRoutes);

app.use("/payments", paymentRoutes);

const port = Number(process.env.PORT) || 3001;

connectDatabase().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`API rodando na porta ${port}`);
  });
}).catch((error) => {
    console.error("Erro ao conectar no MongoDB:", error);
    process.exit(1);
  });