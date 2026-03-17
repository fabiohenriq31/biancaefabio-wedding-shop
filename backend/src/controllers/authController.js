"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = googleLogin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const User_1 = require("../model/User");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function googleLogin(req, res) {
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
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        const token = jsonwebtoken_1.default.sign({
            sub: user._id.toString(),
            email: user.email,
            name: user.name,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
            },
        });
    }
    catch (error) {
        console.error("Erro no login Google:", error);
        return res.status(500).json({ message: "Erro ao autenticar com Google." });
    }
}
//# sourceMappingURL=authController.js.map