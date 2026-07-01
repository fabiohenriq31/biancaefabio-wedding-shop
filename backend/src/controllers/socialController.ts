import type { Request, Response } from "express";
import { ChatMessage } from "../model/ChatMessage";
import { SocialPost } from "../model/SocialPost";
import { User } from "../model/User";

function sanitizeMessage(value: unknown, maxLength = 500) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function publicUser(user: any) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role || "user",
    createdAt: user.createdAt,
  };
}

export async function getSocialUsers(_req: Request, res: Response) {
  try {
    const users = await User.find().sort({ name: 1 });
    return res.json(users.map(publicUser));
  } catch (error) {
    console.error("Erro ao buscar usuarios sociais:", error);
    return res.status(500).json({ message: "Erro ao buscar convidados." });
  }
}

export async function getChatMessages(_req: Request, res: Response) {
  try {
    const messages = await ChatMessage.find({ status: "visible" })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json(messages.reverse());
  } catch (error) {
    console.error("Erro ao buscar chat:", error);
    return res.status(500).json({ message: "Erro ao buscar bate-papo." });
  }
}

export async function createChatMessage(req: Request, res: Response) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ message: "Nao autorizado." });
    }

    const message = sanitizeMessage(req.body.message);

    if (!message) {
      return res.status(400).json({ message: "Escreva uma mensagem." });
    }

    const user = await User.findById(req.user.sub);

    if (!user) {
      return res.status(401).json({ message: "Usuario nao encontrado." });
    }

    const chatMessage = await ChatMessage.create({
      authorId: user._id,
      authorName: user.name,
      authorAvatarUrl: user.avatarUrl || null,
      message,
    });

    return res.status(201).json(chatMessage);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return res.status(500).json({ message: "Erro ao enviar mensagem." });
  }
}

export async function getSocialNotifications(_req: Request, res: Response) {
  try {
    const [posts, messages, users] = await Promise.all([
      SocialPost.find({ status: "approved" }).sort({ createdAt: -1 }).limit(8),
      ChatMessage.find({ status: "visible" }).sort({ createdAt: -1 }).limit(8),
      User.find().sort({ createdAt: -1 }).limit(8),
    ]);

    const notifications = [
      ...posts.map((post) => ({
        id: `post-${post._id}`,
        type: "post",
        title: `${post.authorName} publicou no B&F Social`,
        message: post.message,
        createdAt: post.createdAt,
      })),
      ...messages.map((message) => ({
        id: `chat-${message._id}`,
        type: "chat",
        title: `${message.authorName} enviou mensagem no bate-papo`,
        message: message.message,
        createdAt: message.createdAt,
      })),
      ...users.map((user) => ({
        id: `user-${user._id}`,
        type: "user",
        title: `${user.name} entrou na rede`,
        message: "Novo perfil disponivel para os convidados.",
        createdAt: user.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);

    return res.json(notifications);
  } catch (error) {
    console.error("Erro ao buscar notificacoes:", error);
    return res.status(500).json({ message: "Erro ao buscar notificacoes." });
  }
}
