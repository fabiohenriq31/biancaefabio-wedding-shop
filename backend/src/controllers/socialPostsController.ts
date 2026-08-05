import type { Request, Response } from "express";
import { SocialPost } from "../model/SocialPost";
import {
  buildThumbnailUrl,
  deleteGuestPhotos,
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

function getUploadedFiles(req: Request) {
  if (Array.isArray(req.files)) {
    return req.files;
  }

  if (req.files && typeof req.files === "object") {
    const namedFiles = req.files as Record<string, Express.Multer.File[]>;
    return [...(namedFiles.images || []), ...(namedFiles.image || [])];
  }

  return [];
}

function normalizePost(post: any) {
  const images = Array.isArray(post.images) && post.images.length > 0
    ? post.images.map((image: any) => ({
        imageUrl: image.imageUrl,
        thumbnailUrl: image.thumbnailUrl || buildThumbnailUrl(image.imageUrl),
        publicId: image.publicId,
      }))
    : post.imageUrl
      ? [{
          imageUrl: post.imageUrl,
          thumbnailUrl: post.thumbnailUrl || buildThumbnailUrl(post.imageUrl),
          publicId: post.publicId,
        }]
      : [];

  return {
    ...post.toObject?.() ?? post,
    images,
    imageUrl: images[0]?.imageUrl || post.imageUrl || null,
    thumbnailUrl: images[0]?.thumbnailUrl || post.thumbnailUrl || null,
    publicId: images[0]?.publicId || post.publicId || null,
  };
}

function getPostPublicIds(post: any) {
  const imagePublicIds = Array.isArray(post.images)
    ? post.images.map((image: any) => image.publicId)
    : [];

  if (imagePublicIds.length > 0) {
    return imagePublicIds;
  }

  return [post.publicId];
}

export async function getPublicSocialPosts(_req: Request, res: Response) {
  try {
    const posts = await SocialPost.find({
      isApproved: true,
      status: "approved",
    }).sort({ createdAt: -1 });

    return res.json(posts.map(normalizePost));
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

    const uploadedFiles = getUploadedFiles(req);
    const uploads = await Promise.all(
      uploadedFiles.map(async (file) => {
        const upload = await uploadSocialPostImage(file);
        return {
          imageUrl: upload.secure_url,
          thumbnailUrl: buildThumbnailUrl(upload.secure_url),
          publicId: upload.public_id,
        };
      })
    );

    const imageUrl = uploads[0]?.imageUrl || null;
    const thumbnailUrl = uploads[0]?.thumbnailUrl || null;
    const publicId = uploads[0]?.publicId || null;

    const post = await SocialPost.create({
      authorId: user._id,
      authorName: sanitizeText(user.name, "Convidado", 80),
      authorAvatarUrl: user.avatarUrl || null,
      message,
      imageUrl,
      thumbnailUrl,
      publicId,
      images: uploads,
      likeCount: 0,
      isApproved: true,
      status: "approved",
    });

    return res.status(201).json({
      message: "Seu post ja apareceu no B&F Social!",
      post: normalizePost(post),
    });
  } catch (error) {
    console.error("Erro ao criar post social:", error);
    return res.status(500).json({ message: "Erro ao publicar post." });
  }
}

export async function likeSocialPost(req: Request, res: Response) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ message: "Nao autorizado." });
    }

    const post = await SocialPost.findOne({
      _id: req.params.id,
      isApproved: true,
      status: "approved",
    });

    if (!post) {
      return res.status(404).json({ message: "Post nao encontrado." });
    }

    const likedBy = ((post as any).likedBy || []).map((id: any) => id.toString());
    const hasLiked = likedBy.includes(req.user.sub);

    if (hasLiked) {
      (post as any).likedBy = ((post as any).likedBy || []).filter(
        (id: any) => id.toString() !== req.user?.sub
      );
    } else {
      (post as any).likedBy = [...((post as any).likedBy || []), req.user.sub];
    }

    post.likeCount = (post as any).likedBy.length;
    await post.save();

    return res.json(normalizePost(post));
  } catch (error) {
    console.error("Erro ao curtir post:", error);
    return res.status(500).json({ message: "Erro ao curtir post." });
  }
}

export async function repostSocialPost(req: Request, res: Response) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ message: "Nao autorizado." });
    }

    const post = await SocialPost.findOne({
      _id: req.params.id,
      isApproved: true,
      status: "approved",
    });

    if (!post) {
      return res.status(404).json({ message: "Post nao encontrado." });
    }

    const repostedBy = ((post as any).repostedBy || []).map((id: any) => id.toString());
    const hasReposted = repostedBy.includes(req.user.sub);

    if (hasReposted) {
      (post as any).repostedBy = ((post as any).repostedBy || []).filter(
        (id: any) => id.toString() !== req.user?.sub
      );
    } else {
      (post as any).repostedBy = [...((post as any).repostedBy || []), req.user.sub];
    }

    (post as any).repostCount = (post as any).repostedBy.length;
    await post.save();

    return res.json(normalizePost(post));
  } catch (error) {
    console.error("Erro ao repostar:", error);
    return res.status(500).json({ message: "Erro ao repostar." });
  }
}

export async function commentSocialPost(req: Request, res: Response) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ message: "Nao autorizado." });
    }

    const message = sanitizeMessage(req.body.message);

    if (!message) {
      return res.status(400).json({ message: "Escreva um comentario." });
    }

    const [post, user] = await Promise.all([
      SocialPost.findOne({
        _id: req.params.id,
        isApproved: true,
        status: "approved",
      }),
      User.findById(req.user.sub),
    ]);

    if (!post) {
      return res.status(404).json({ message: "Post nao encontrado." });
    }

    if (!user) {
      return res.status(401).json({ message: "Usuario nao encontrado." });
    }

    (post as any).comments = [
      ...((post as any).comments || []),
      {
        authorId: user._id,
        authorName: user.name,
        authorAvatarUrl: user.avatarUrl || null,
        message,
        createdAt: new Date(),
      },
    ];

    await post.save();

    return res.status(201).json(normalizePost(post));
  } catch (error) {
    console.error("Erro ao comentar:", error);
    return res.status(500).json({ message: "Erro ao comentar." });
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

    return res.json(normalizePost(post));
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

    await deleteGuestPhotos(getPostPublicIds(post));

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
    return res.json(posts.map(normalizePost));
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

    return res.json(normalizePost(post));
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

    return res.json(normalizePost(post));
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

    await deleteGuestPhotos(getPostPublicIds(post));

    await post.deleteOne();
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir post:", error);
    return res.status(500).json({ message: "Erro ao excluir post." });
  }
}
