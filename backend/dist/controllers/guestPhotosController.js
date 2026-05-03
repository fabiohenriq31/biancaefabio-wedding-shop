"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicGuestPhotos = getPublicGuestPhotos;
exports.createGuestPhoto = createGuestPhoto;
exports.getAdminGuestPhotos = getAdminGuestPhotos;
exports.hideGuestPhoto = hideGuestPhoto;
exports.showGuestPhoto = showGuestPhoto;
exports.removeGuestPhoto = removeGuestPhoto;
const GuestPhoto_1 = require("../model/GuestPhoto");
const cloudinaryService_1 = require("../services/cloudinaryService");
function sanitizeGuestName(value) {
    const text = String(value || "")
        .replace(/[<>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);
    return text || "Convidado";
}
async function getPublicGuestPhotos(_req, res) {
    try {
        const photos = await GuestPhoto_1.GuestPhoto.find({
            isApproved: true,
            status: "approved",
        }).sort({ createdAt: -1 });
        return res.json(photos);
    }
    catch (error) {
        console.error("Erro ao buscar fotos públicas:", error);
        return res.status(500).json({ message: "Erro ao buscar fotos." });
    }
}
async function createGuestPhoto(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Imagem não enviada." });
        }
        const upload = await (0, cloudinaryService_1.uploadGuestPhoto)(req.file);
        const imageUrl = upload.secure_url;
        const photo = await GuestPhoto_1.GuestPhoto.create({
            imageUrl,
            thumbnailUrl: (0, cloudinaryService_1.buildThumbnailUrl)(imageUrl),
            publicId: upload.public_id,
            guestName: sanitizeGuestName(req.body.guestName),
            isApproved: true,
            status: "approved",
        });
        return res.status(201).json({
            message: "Sua foto já apareceu no mural! 💙",
            photo,
        });
    }
    catch (error) {
        console.error("Erro ao enviar foto:", error);
        return res.status(500).json({ message: "Erro ao enviar foto." });
    }
}
async function getAdminGuestPhotos(req, res) {
    try {
        const status = String(req.query.status || "all");
        const filter = status === "hidden"
            ? { status: "hidden" }
            : status === "approved" || status === "visible"
                ? { status: "approved" }
                : {};
        const photos = await GuestPhoto_1.GuestPhoto.find(filter).sort({ createdAt: -1 });
        return res.json(photos);
    }
    catch (error) {
        console.error("Erro ao buscar fotos no admin:", error);
        return res.status(500).json({ message: "Erro ao buscar fotos." });
    }
}
async function hideGuestPhoto(req, res) {
    try {
        const photo = await GuestPhoto_1.GuestPhoto.findByIdAndUpdate(req.params.id, { status: "hidden" }, { new: true });
        if (!photo) {
            return res.status(404).json({ message: "Foto não encontrada." });
        }
        return res.json(photo);
    }
    catch (error) {
        console.error("Erro ao ocultar foto:", error);
        return res.status(500).json({ message: "Erro ao ocultar foto." });
    }
}
async function showGuestPhoto(req, res) {
    try {
        const photo = await GuestPhoto_1.GuestPhoto.findByIdAndUpdate(req.params.id, { isApproved: true, status: "approved" }, { new: true });
        if (!photo) {
            return res.status(404).json({ message: "Foto não encontrada." });
        }
        return res.json(photo);
    }
    catch (error) {
        console.error("Erro ao reexibir foto:", error);
        return res.status(500).json({ message: "Erro ao reexibir foto." });
    }
}
async function removeGuestPhoto(req, res) {
    try {
        const photo = await GuestPhoto_1.GuestPhoto.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: "Foto não encontrada." });
        }
        await (0, cloudinaryService_1.deleteGuestPhoto)(photo.publicId);
        await photo.deleteOne();
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao excluir foto:", error);
        return res.status(500).json({ message: "Erro ao excluir foto." });
    }
}
//# sourceMappingURL=guestPhotosController.js.map