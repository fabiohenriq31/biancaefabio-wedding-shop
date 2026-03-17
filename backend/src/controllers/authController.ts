import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../model/User";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLogin(req: Request, res: Response) {
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
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Erro no login Google:", error);
    return res.status(500).json({ message: "Erro ao autenticar com Google." });
  }
}