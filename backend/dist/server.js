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
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/shopping", (_req, res) => {
    res.json({ ok: true, message: "Bianca e Fábio Shopping API" });
});
app.use("/products", productRoutes_1.default);
app.use("/auth", authRoutes_1.default);
app.use("/orders", orderRoutes_1.default);
app.use("/payments", paymentRoutes_1.default);
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