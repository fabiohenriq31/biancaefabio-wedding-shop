import { Router } from "express";
import {
  createGuestPhoto,
  getPublicGuestPhotos,
} from "../controllers/guestPhotosController";
import { guestPhotoUpload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", getPublicGuestPhotos);
router.post("/", guestPhotoUpload.single("photo"), createGuestPhoto);

export default router;
