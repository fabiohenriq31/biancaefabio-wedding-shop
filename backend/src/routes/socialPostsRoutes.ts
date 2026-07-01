import { Router } from "express";
import {
  createSocialPost,
  getPublicSocialPosts,
  likeSocialPost,
} from "../controllers/socialPostsController";
import { requireAuth } from "../middleware/authMiddleware";
import { guestPhotoUpload } from "../middleware/uploadMiddleware";

const router = Router();

router.use(requireAuth);
router.get("/", getPublicSocialPosts);
router.post("/", guestPhotoUpload.single("image"), createSocialPost);
router.patch("/:id/like", likeSocialPost);

export default router;
