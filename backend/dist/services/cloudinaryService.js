"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadGuestPhoto = uploadGuestPhoto;
exports.uploadSocialPostImage = uploadSocialPostImage;
exports.uploadUserAvatar = uploadUserAvatar;
exports.deleteGuestPhoto = deleteGuestPhoto;
exports.buildThumbnailUrl = buildThumbnailUrl;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const folder = process.env.CLOUDINARY_FOLDER || "casamento/guest-photos";
const socialFolder = process.env.CLOUDINARY_SOCIAL_FOLDER || "casamento/social-posts";
const avatarFolder = process.env.CLOUDINARY_AVATAR_FOLDER || "casamento/avatars";
async function uploadGuestPhoto(file) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: "image",
            transformation: [
                { quality: "auto", fetch_format: "auto" },
                { width: 1800, crop: "limit" },
            ],
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error("Erro ao enviar imagem."));
            }
            resolve(result);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
}
async function uploadSocialPostImage(file) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: socialFolder,
            resource_type: "image",
            transformation: [
                { quality: "auto", fetch_format: "auto" },
                { width: 1800, crop: "limit" },
            ],
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error("Erro ao enviar imagem."));
            }
            resolve(result);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
}
async function uploadUserAvatar(file) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: avatarFolder,
            resource_type: "image",
            transformation: [
                { width: 600, height: 600, crop: "fill", gravity: "face", quality: "auto", fetch_format: "auto" },
            ],
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error("Erro ao enviar avatar."));
            }
            resolve(result);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
}
async function deleteGuestPhoto(publicId) {
    if (!publicId)
        return;
    await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: "image" });
}
function buildThumbnailUrl(imageUrl) {
    return imageUrl.replace("/upload/", "/upload/c_fill,w_520,h_390,q_auto,f_auto/");
}
//# sourceMappingURL=cloudinaryService.js.map