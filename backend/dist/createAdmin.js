"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./config/db");
const User_1 = require("./model/User");
dotenv_1.default.config();
async function main() {
    const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = String(process.env.ADMIN_PASSWORD || "");
    const name = String(process.env.ADMIN_NAME || "Administrador").trim();
    if (!email || !password) {
        throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD antes de executar.");
    }
    if (password.length < 8) {
        throw new Error("A senha do admin precisa ter pelo menos 8 caracteres.");
    }
    await (0, db_1.connectDatabase)();
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const user = await User_1.User.findOneAndUpdate({ email }, {
        email,
        name,
        passwordHash,
        role: "admin",
        provider: "local",
        avatarUrl: null,
    }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
    });
    console.log(`Admin pronto: ${user.email}`);
}
main()
    .catch((error) => {
    console.error("Erro ao criar admin:", error);
    process.exitCode = 1;
})
    .finally(async () => {
    await mongoose_1.default.disconnect();
});
//# sourceMappingURL=createAdmin.js.map