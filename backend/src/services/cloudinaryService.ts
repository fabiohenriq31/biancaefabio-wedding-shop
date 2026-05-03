import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const folder = process.env.CLOUDINARY_FOLDER || "casamento/guest-photos";

export async function uploadGuestPhoto(file: Express.Multer.File) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
          { width: 1800, crop: "limit" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Erro ao enviar imagem."));
        }

        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
}

export async function deleteGuestPhoto(publicId: string) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export function buildThumbnailUrl(imageUrl: string) {
  return imageUrl.replace("/upload/", "/upload/c_fill,w_520,h_390,q_auto,f_auto/");
}
