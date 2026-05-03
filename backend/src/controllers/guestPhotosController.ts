import type { Request, Response } from "express";
import { GuestPhoto } from "../model/GuestPhoto";
import {
  buildThumbnailUrl,
  deleteGuestPhoto,
  uploadGuestPhoto,
} from "../services/cloudinaryService";

function sanitizeGuestName(value: unknown) {
  const text = String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

  return text || "Convidado";
}

export async function getPublicGuestPhotos(_req: Request, res: Response) {
  try {
    const photos = await GuestPhoto.find({
      isApproved: true,
      status: "approved",
    }).sort({ createdAt: -1 });

    return res.json(photos);
  } catch (error) {
    console.error("Erro ao buscar fotos públicas:", error);
    return res.status(500).json({ message: "Erro ao buscar fotos." });
  }
}

export async function createGuestPhoto(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Imagem não enviada." });
    }

    const upload = await uploadGuestPhoto(req.file);
    const imageUrl = upload.secure_url;

    const photo = await GuestPhoto.create({
      imageUrl,
      thumbnailUrl: buildThumbnailUrl(imageUrl),
      publicId: upload.public_id,
      guestName: sanitizeGuestName(req.body.guestName),
      isApproved: true,
      status: "approved",
    });

    return res.status(201).json({
      message: "Sua foto já apareceu no mural! 💙",
      photo,
    });
  } catch (error) {
    console.error("Erro ao enviar foto:", error);
    return res.status(500).json({ message: "Erro ao enviar foto." });
  }
}

export async function getAdminGuestPhotos(req: Request, res: Response) {
  try {
    const status = String(req.query.status || "all");
    const filter = status === "hidden"
      ? { status: "hidden" }
      : status === "approved" || status === "visible"
        ? { status: "approved" }
        : {};

    const photos = await GuestPhoto.find(filter).sort({ createdAt: -1 });
    return res.json(photos);
  } catch (error) {
    console.error("Erro ao buscar fotos no admin:", error);
    return res.status(500).json({ message: "Erro ao buscar fotos." });
  }
}

export async function hideGuestPhoto(req: Request, res: Response) {
  try {
    const photo = await GuestPhoto.findByIdAndUpdate(
      req.params.id,
      { status: "hidden" },
      { new: true }
    );

    if (!photo) {
      return res.status(404).json({ message: "Foto não encontrada." });
    }

    return res.json(photo);
  } catch (error) {
    console.error("Erro ao ocultar foto:", error);
    return res.status(500).json({ message: "Erro ao ocultar foto." });
  }
}

export async function showGuestPhoto(req: Request, res: Response) {
  try {
    const photo = await GuestPhoto.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, status: "approved" },
      { new: true }
    );

    if (!photo) {
      return res.status(404).json({ message: "Foto não encontrada." });
    }

    return res.json(photo);
  } catch (error) {
    console.error("Erro ao reexibir foto:", error);
    return res.status(500).json({ message: "Erro ao reexibir foto." });
  }
}

export async function removeGuestPhoto(req: Request, res: Response) {
  try {
    const photo = await GuestPhoto.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: "Foto não encontrada." });
    }

    await deleteGuestPhoto(photo.publicId);
    await photo.deleteOne();

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir foto:", error);
    return res.status(500).json({ message: "Erro ao excluir foto." });
  }
}
