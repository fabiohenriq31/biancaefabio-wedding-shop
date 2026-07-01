"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSocialPosts = getPublicSocialPosts;
exports.createSocialPost = createSocialPost;
exports.likeSocialPost = likeSocialPost;
exports.updateSocialPost = updateSocialPost;
exports.deleteOwnSocialPost = deleteOwnSocialPost;
exports.getAdminSocialPosts = getAdminSocialPosts;
exports.hideSocialPost = hideSocialPost;
exports.showSocialPost = showSocialPost;
exports.removeSocialPost = removeSocialPost;
const SocialPost_1 = require("../model/SocialPost");
const cloudinaryService_1 = require("../services/cloudinaryService");
const User_1 = require("../model/User");
function sanitizeText(value, fallback, maxLength) {
    const text = String(value || "")
        .replace(/[<>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
    return text || fallback;
}
function sanitizeMessage(value) {
    return String(value || "")
        .replace(/[<>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 280);
}
async function getPublicSocialPosts(_req, res) {
    try {
        const posts = await SocialPost_1.SocialPost.find({
            isApproved: true,
            status: "approved",
        }).sort({ createdAt: -1 });
        return res.json(posts);
    }
    catch (error) {
        console.error("Erro ao buscar posts sociais:", error);
        return res.status(500).json({ message: "Erro ao buscar posts." });
    }
}
async function createSocialPost(req, res) {
    try {
        if (!req.user?.sub) {
            return res.status(401).json({ message: "NÃ£o autorizado." });
        }
        const message = sanitizeMessage(req.body.message);
        if (!message) {
            return res.status(400).json({ message: "Escreva uma mensagem para publicar." });
        }
        const user = await User_1.User.findById(req.user.sub);
        if (!user) {
            return res.status(401).json({ message: "Usuario nÃ£o encontrado." });
        }
        let imageUrl = null;
        let thumbnailUrl = null;
        let publicId = null;
        if (req.file) {
            const upload = await (0, cloudinaryService_1.uploadSocialPostImage)(req.file);
            imageUrl = upload.secure_url;
            thumbnailUrl = (0, cloudinaryService_1.buildThumbnailUrl)(imageUrl);
            publicId = upload.public_id;
        }
        const post = await SocialPost_1.SocialPost.create({
            authorId: user._id,
            authorName: sanitizeText(user.name, "Convidado", 80),
            authorAvatarUrl: user.avatarUrl || null,
            message,
            imageUrl,
            thumbnailUrl,
            publicId,
            likeCount: 0,
            isApproved: true,
            status: "approved",
        });
        return res.status(201).json({
            message: "Seu post ja apareceu no B&F Social!",
            post,
        });
    }
    catch (error) {
        console.error("Erro ao criar post social:", error);
        return res.status(500).json({ message: "Erro ao publicar post." });
    }
}
async function likeSocialPost(req, res) {
    try {
        const post = await SocialPost_1.SocialPost.findOneAndUpdate({
            _id: req.params.id,
            isApproved: true,
            status: "approved",
        }, { $inc: { likeCount: 1 } }, { new: true });
        if (!post) {
            return res.status(404).json({ message: "Post nao encontrado." });
        }
        return res.json(post);
    }
    catch (error) {
        console.error("Erro ao curtir post:", error);
        return res.status(500).json({ message: "Erro ao curtir post." });
    }
}
async function updateSocialPost(req, res) {
    try {
        if (!req.user?.sub) {
            return res.status(401).json({ message: "Nao autorizado." });
        }
        const message = sanitizeMessage(req.body.message);
        if (!message) {
            return res.status(400).json({ message: "Escreva uma mensagem." });
        }
        const post = await SocialPost_1.SocialPost.findOneAndUpdate({ _id: req.params.id, authorId: req.user.sub }, { message }, { new: true });
        if (!post) {
            return res.status(404).json({ message: "Post nao encontrado ou sem permissao." });
        }
        return res.json(post);
    }
    catch (error) {
        console.error("Erro ao editar post:", error);
        return res.status(500).json({ message: "Erro ao editar post." });
    }
}
async function deleteOwnSocialPost(req, res) {
    try {
        if (!req.user?.sub) {
            return res.status(401).json({ message: "Nao autorizado." });
        }
        const post = await SocialPost_1.SocialPost.findOne({ _id: req.params.id, authorId: req.user.sub });
        if (!post) {
            return res.status(404).json({ message: "Post nao encontrado ou sem permissao." });
        }
        if (post.publicId) {
            await (0, cloudinaryService_1.deleteGuestPhoto)(post.publicId);
        }
        await post.deleteOne();
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao excluir post:", error);
        return res.status(500).json({ message: "Erro ao excluir post." });
    }
}
async function getAdminSocialPosts(req, res) {
    try {
        const status = String(req.query.status || "all");
        const filter = status === "hidden"
            ? { status: "hidden" }
            : status === "approved" || status === "visible"
                ? { status: "approved" }
                : {};
        const posts = await SocialPost_1.SocialPost.find(filter).sort({ createdAt: -1 });
        return res.json(posts);
    }
    catch (error) {
        console.error("Erro ao buscar posts sociais no admin:", error);
        return res.status(500).json({ message: "Erro ao buscar posts." });
    }
}
async function hideSocialPost(req, res) {
    try {
        const post = await SocialPost_1.SocialPost.findByIdAndUpdate(req.params.id, { status: "hidden" }, { new: true });
        if (!post) {
            return res.status(404).json({ message: "Post nao encontrado." });
        }
        return res.json(post);
    }
    catch (error) {
        console.error("Erro ao ocultar post:", error);
        return res.status(500).json({ message: "Erro ao ocultar post." });
    }
}
async function showSocialPost(req, res) {
    try {
        const post = await SocialPost_1.SocialPost.findByIdAndUpdate(req.params.id, { isApproved: true, status: "approved" }, { new: true });
        if (!post) {
            return res.status(404).json({ message: "Post nao encontrado." });
        }
        return res.json(post);
    }
    catch (error) {
        console.error("Erro ao reexibir post:", error);
        return res.status(500).json({ message: "Erro ao reexibir post." });
    }
}
async function removeSocialPost(req, res) {
    try {
        const post = await SocialPost_1.SocialPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post nao encontrado." });
        }
        if (post.publicId) {
            await (0, cloudinaryService_1.deleteGuestPhoto)(post.publicId);
        }
        await post.deleteOne();
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao excluir post:", error);
        return res.status(500).json({ message: "Erro ao excluir post." });
    }
}
//# sourceMappingURL=socialPostsController.js.map