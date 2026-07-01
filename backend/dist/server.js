"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const guestPhotosRoutes_1 = __importDefault(require("./routes/guestPhotosRoutes"));
const socialPostsRoutes_1 = __importDefault(require("./routes/socialPostsRoutes"));
const socialRoutes_1 = __importDefault(require("./routes/socialRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const guestRoutes_1 = __importDefault(require("./routes/guestRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        return callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/shopping", (_req, res) => {
    res.json({ ok: true, message: "Bianca e Fábio Shopping API" });
});
app.use("/products", productRoutes_1.default);
app.use("/guest-photos", guestPhotosRoutes_1.default);
app.use("/social-posts", socialPostsRoutes_1.default);
app.use("/social", socialRoutes_1.default);
app.use("/rsvp", guestRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/guest-photos", guestPhotosRoutes_1.default);
app.use("/api/social-posts", socialPostsRoutes_1.default);
app.use("/api/social", socialRoutes_1.default);
app.use("/api/rsvp", guestRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/auth", authRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/orders", orderRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/payments", paymentRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use((error, _req, res, _next) => {
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Imagem maior que 15 MB." });
    }
    if (error.message === "Formato de imagem não permitido.") {
        return res.status(400).json({ message: error.message });
    }
    console.error("Erro não tratado:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
});
const port = Number(process.env.PORT) || 3001;
(0, db_1.connectDatabase)().then(() => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`API rodando na porta ${port}`);
    });
}).catch((error) => {
    console.error("Erro ao conectar no MongoDB:", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map