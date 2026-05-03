import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../model/User";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function signAuthToken(user: any) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || "user",
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
}

function publicUser(user: any) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role || "user",
  };
}

export async function googleLogin(req: Request, res: Response) {
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
    audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email || !payload.name) {
      return res.status(401).json({ message: "Token Google inválido." });
    }

    const user = await User.findOneAndUpdate(
      { email: payload.email },
      {
        googleId: payload.sub,
        name: payload.name,
        avatarUrl: payload.picture || "",
        provider: "google",
        role: ADMIN_EMAILS.includes(payload.email.toLowerCase()) ? "admin" : "user",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const token = signAuthToken(user);

    return res.json({
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Erro no login Google:", error);
    return res.status(500).json({ message: "Erro ao autenticar com Google." });
  }
}

export async function passwordLogin(req: Request, res: Response) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Email ou senha inválidos." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou senha inválidos." });
    }

    const token = signAuthToken(user);

    return res.json({
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Erro no login por senha:", error);
    return res.status(500).json({ message: "Erro ao autenticar." });
  }
}
