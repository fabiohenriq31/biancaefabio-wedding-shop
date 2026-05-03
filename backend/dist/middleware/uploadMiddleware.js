"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestPhotoUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
]);
exports.guestPhotoUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024,
    },
    fileFilter(_req, file, callback) {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(new Error("Formato de imagem não permitido."));
        }
        callback(null, true);
    },
});
//# sourceMappingURL=uploadMiddleware.js.map