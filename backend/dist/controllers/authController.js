"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = googleLogin;
exports.passwordLogin = passwordLogin;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const User_1 = require("../model/User");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
function signAuthToken(user) {
    return jsonwebtoken_1.default.sign({
        sub: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
function publicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role || "user",
    };
}
async function googleLogin(req, res) {
    console.log("POST /auth/google hit");
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: "Credential não enviada." });
        }
        console.log("GOOGLE_CLIENT_ID backend:", process.env.GOOGLE_CLIENT_ID);
        console.log("Credential recebida:", !!credential);
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email || !payload.name) {
            return res.status(401).json({ message: "Token Google inválido." });
        }
        const user = await User_1.User.findOneAndUpdate({ email: payload.email }, {
            googleId: payload.sub,
            name: payload.name,
            avatarUrl: payload.picture || "",
            provider: "google",
            role: ADMIN_EMAILS.includes(payload.email.toLowerCase()) ? "admin" : "user",
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        const token = signAuthToken(user);
        return res.json({
            token,
            user: publicUser(user),
        });
    }
    catch (error) {
        console.error("Erro no login Google:", error);
        return res.status(500).json({ message: "Erro ao autenticar com Google." });
    }
}
async function passwordLogin(req, res) {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");
        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios." });
        }
        const user = await User_1.User.findOne({ email }).select("+passwordHash");
        if (!user || !user.passwordHash) {
            return res.status(401).json({ message: "Email ou senha inválidos." });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou senha inválidos." });
        }
        const token = signAuthToken(user);
        return res.json({
            token,
            user: publicUser(user),
        });
    }
    catch (error) {
        console.error("Erro no login por senha:", error);
        return res.status(500).json({ message: "Erro ao autenticar." });
    }
}
//# sourceMappingURL=authController.js.map