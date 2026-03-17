"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
function requireAdmin(req, res, next) {
    const userEmail = req.user?.email?.toLowerCase();
    if (!userEmail) {
        return res.status(401).json({ message: "Usuário não autenticado." });
    }
    if (!ADMIN_EMAILS.includes(userEmail)) {
        return res.status(403).json({ message: "Acesso negado." });
    }
    next();
}
//# sourceMappingURL=adminMiddleware.js.map