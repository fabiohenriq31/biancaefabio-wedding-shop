import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import guestPhotosRoutes from "./routes/guestPhotosRoutes";
import socialPostsRoutes from "./routes/socialPostsRoutes";
import socialRoutes from "./routes/socialRoutes";
import adminRoutes from "./routes/adminRoutes";
import guestRoutes from "./routes/guestRoutes";

dotenv.config();

const app = express();
const defaultAllowedOrigins = [
  "https://www.shoppingbiancaefabio.com.br",
  "https://shoppingbiancaefabio.com.br",
  "https://www.biancaefabio.com.br",
  "https://biancaefabio.com.br",
  "http://localhost:3000",
  "http://localhost:5173",
];

const allowedOrigins = [
  ...defaultAllowedOrigins,
  ...(process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/shopping", (_req,res) => {
  res.json({ ok: true, message: "Bianca e Fábio Shopping API" })
});

app.use("/products", productRoutes);
app.use("/guest-photos", guestPhotosRoutes);
app.use("/social-posts", socialPostsRoutes);
app.use("/social", socialRoutes);
app.use("/rsvp", guestRoutes);
app.use("/admin", adminRoutes);

app.use("/api/products", productRoutes);
app.use("/api/guest-photos", guestPhotosRoutes);
app.use("/api/social-posts", socialPostsRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/rsvp", guestRoutes);
app.use("/api/admin", adminRoutes);

app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.use("/orders", orderRoutes);
app.use("/api/orders", orderRoutes);

app.use("/payments", paymentRoutes);
app.use("/api/payments", paymentRoutes);

app.use(
  (
    error: Error & { code?: string },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Imagem maior que 15 MB." });
    }

    if (error.message === "Formato de imagem não permitido.") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Erro não tratado:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
);

const port = Number(process.env.PORT) || 3001;

connectDatabase().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`API rodando na porta ${port}`);
  });
}).catch((error) => {
    console.error("Erro ao conectar no MongoDB:", error);
    process.exit(1);
  });
