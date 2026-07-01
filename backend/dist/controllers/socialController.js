"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocialUsers = getSocialUsers;
exports.getChatMessages = getChatMessages;
exports.createChatMessage = createChatMessage;
exports.getSocialNotifications = getSocialNotifications;
const ChatMessage_1 = require("../model/ChatMessage");
const SocialPost_1 = require("../model/SocialPost");
const User_1 = require("../model/User");
function sanitizeMessage(value, maxLength = 500) {
    return String(value || "")
        .replace(/[<>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}
function publicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role || "user",
        createdAt: user.createdAt,
    };
}
async function getSocialUsers(_req, res) {
    try {
        const users = await User_1.User.find().sort({ name: 1 });
        return res.json(users.map(publicUser));
    }
    catch (error) {
        console.error("Erro ao buscar usuarios sociais:", error);
        return res.status(500).json({ message: "Erro ao buscar convidados." });
    }
}
async function getChatMessages(_req, res) {
    try {
        const messages = await ChatMessage_1.ChatMessage.find({ status: "visible" })
            .sort({ createdAt: -1 })
            .limit(100);
        return res.json(messages.reverse());
    }
    catch (error) {
        console.error("Erro ao buscar chat:", error);
        return res.status(500).json({ message: "Erro ao buscar bate-papo." });
    }
}
async function createChatMessage(req, res) {
    try {
        if (!req.user?.sub) {
            return res.status(401).json({ message: "Nao autorizado." });
        }
        const message = sanitizeMessage(req.body.message);
        if (!message) {
            return res.status(400).json({ message: "Escreva uma mensagem." });
        }
        const user = await User_1.User.findById(req.user.sub);
        if (!user) {
            return res.status(401).json({ message: "Usuario nao encontrado." });
        }
        const chatMessage = await ChatMessage_1.ChatMessage.create({
            authorId: user._id,
            authorName: user.name,
            authorAvatarUrl: user.avatarUrl || null,
            message,
        });
        return res.status(201).json(chatMessage);
    }
    catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        return res.status(500).json({ message: "Erro ao enviar mensagem." });
    }
}
async function getSocialNotifications(_req, res) {
    try {
        const [posts, messages, users] = await Promise.all([
            SocialPost_1.SocialPost.find({ status: "approved" }).sort({ createdAt: -1 }).limit(8),
            ChatMessage_1.ChatMessage.find({ status: "visible" }).sort({ createdAt: -1 }).limit(8),
            User_1.User.find().sort({ createdAt: -1 }).limit(8),
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
    }
    catch (error) {
        console.error("Erro ao buscar notificacoes:", error);
        return res.status(500).json({ message: "Erro ao buscar notificacoes." });
    }
}
//# sourceMappingURL=socialController.js.map