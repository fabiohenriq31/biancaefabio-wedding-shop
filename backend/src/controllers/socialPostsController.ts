import type { Request, Response } from "express";
import { SocialPost } from "../model/SocialPost";
import {
  buildThumbnailUrl,
  deleteGuestPhoto,
  uploadSocialPostImage,
} from "../services/cloudinaryService";
import { User } from "../model/User";

function sanitizeText(value: unknown, fallback: string, maxLength: number) {
  const text = String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

  return text || fallback;
}

function sanitizeMessage(value: unknown) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

export async function getPublicSocialPosts(_req: Request, res: Response) {
  try {
    const posts = await SocialPost.find({
      isApproved: true,
      status: "approved",
    }).sort({ createdAt: -1 });

    return res.json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts sociais:", error);
    return res.status(500).json({ message: "Erro ao buscar posts." });
  }
}

export async function createSocialPost(req: Request, res: Response) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ message: "NÃ£o autorizado." });
    }

    const message = sanitizeMessage(req.body.message);

    if (!message) {
      return res.status(400).json({ message: "Escreva uma mensagem para publicar." });
    }

    const user = await User.findById(req.user.sub);

    if (!user) {
      return res.status(401).json({ message: "Usuario nÃ£o encontrado." });
    }

    let imageUrl: string | null = null;
    let thumbnailUrl: string | null = null;
    let publicId: string | null = null;

    if (req.file) {
      const upload = await uploadSocialPostImage(req.file);
      imageUrl = upload.secure_url;
      thumbnailUrl = buildThumbnailUrl(imageUrl);
      publicId = upload.public_id;
    }

    const post = await SocialPost.create({
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
  } catch (error) {
    console.error("Erro ao criar post social:", error);
    return res.status(500).json({ message: "Erro ao publicar post." });
  }
}

export async function likeSocialPost(req: Request, res: Response) {
  try {
    const post = await SocialPost.findOneAndUpdate(
      {
        _id: req.params.id,
        isApproved: true,
        status: "approved",
      },
      { $inc: { likeCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post nao encontrado." });
    }

    return res.json(post);
  } catch (error) {
    console.error("Erro ao curtir post:", error);
    return res.status(500).json({ message: "Erro ao curtir post." });
  }
}

export async function updateSocialPost(req: Request, res: Response) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ message: "Nao autorizado." });
    }

    const message = sanitizeMessage(req.body.message);

    if (!message) {
      return res.status(400).json({ message: "Escreva uma mensagem." });
    }

    const post = await SocialPost.findOneAndUpdate(
      { _id: req.params.id, authorId: req.user.sub },
      { message },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post nao encontrado ou sem permissao." });
    }

    return res.json(post);
  } catch (error) {
    console.error("Erro ao editar post:", error);
    return res.status(500).json({ message: "Erro ao editar post." });
  }
}

export async function deleteOwnSocialPost(req: Request, res: Response) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ message: "Nao autorizado." });
    }

    const post = await SocialPost.findOne({ _id: req.params.id, authorId: req.user.sub });

    if (!post) {
      return res.status(404).json({ message: "Post nao encontrado ou sem permissao." });
    }

    if (post.publicId) {
      await deleteGuestPhoto(post.publicId);
    }

    await post.deleteOne();
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir post:", error);
    return res.status(500).json({ message: "Erro ao excluir post." });
  }
}

export async function getAdminSocialPosts(req: Request, res: Response) {
  try {
    const status = String(req.query.status || "all");
    const filter = status === "hidden"
      ? { status: "hidden" }
      : status === "approved" || status === "visible"
        ? { status: "approved" }
        : {};

    const posts = await SocialPost.find(filter).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts sociais no admin:", error);
    return res.status(500).json({ message: "Erro ao buscar posts." });
  }
}

export async function hideSocialPost(req: Request, res: Response) {
  try {
    const post = await SocialPost.findByIdAndUpdate(
      req.params.id,
      { status: "hidden" },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post nao encontrado." });
    }

    return res.json(post);
  } catch (error) {
    console.error("Erro ao ocultar post:", error);
    return res.status(500).json({ message: "Erro ao ocultar post." });
  }
}

export async function showSocialPost(req: Request, res: Response) {
  try {
    const post = await SocialPost.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, status: "approved" },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post nao encontrado." });
    }

    return res.json(post);
  } catch (error) {
    console.error("Erro ao reexibir post:", error);
    return res.status(500).json({ message: "Erro ao reexibir post." });
  }
}

export async function removeSocialPost(req: Request, res: Response) {
  try {
    const post = await SocialPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post nao encontrado." });
    }

    if (post.publicId) {
      await deleteGuestPhoto(post.publicId);
    }

    await post.deleteOne();
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir post:", error);
    return res.status(500).json({ message: "Erro ao excluir post." });
  }
}
