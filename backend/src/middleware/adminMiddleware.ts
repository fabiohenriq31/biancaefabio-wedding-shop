import type { Request, Response, NextFunction } from "express";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userEmail = req.user?.email?.toLowerCase();

  if (!userEmail) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  if (!ADMIN_EMAILS.includes(userEmail)) {
    return res.status(403).json({ message: "Acesso negado." });
  }

  next();
}