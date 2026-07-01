import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../model/User";
import { uploadUserAvatar } from "../services/cloudinaryService";

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

function sanitizeName(value: unknown) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
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

export async function registerUser(req: Request, res: Response) {
  try {
    const name = sanitizeName(req.body.name);
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, email e senha sÃ£o obrigatÃ³rios." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "A senha precisa ter pelo menos 6 caracteres." });
    }

    const existingUser = await User.findOne({ email }).select("+passwordHash");

    if (existingUser?.passwordHash) {
      return res.status(409).json({ message: "Este email jÃ¡ possui uma conta." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = existingUser
      ? await User.findByIdAndUpdate(
          existingUser._id,
          { name, passwordHash, provider: existingUser.googleId ? "both" : "local" },
          { new: true }
        )
      : await User.create({
          name,
          email,
          passwordHash,
          provider: "local",
          role: ADMIN_EMAILS.includes(email) ? "admin" : "user",
        });

    const token = signAuthToken(user);

    return res.status(201).json({
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuario:", error);
    return res.status(500).json({ message: "Erro ao criar conta." });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ message: "NÃ£o autorizado." });
    }

    const updates: Record<string, unknown> = {};
    const name = sanitizeName(req.body.name);

    if (name) {
      updates.name = name;
    }

    if (req.file) {
      const upload = await uploadUserAvatar(req.file);
      updates.avatarUrl = upload.secure_url;
      updates.avatarPublicId = upload.public_id;
    }

    const user = await User.findByIdAndUpdate(req.user.sub, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Usuario nÃ£o encontrado." });
    }

    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({ message: "Erro ao atualizar perfil." });
  }
}
