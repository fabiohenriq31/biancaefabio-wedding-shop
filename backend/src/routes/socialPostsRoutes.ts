import { Router } from "express";
import {
  createSocialPost,
  deleteOwnSocialPost,
  getPublicSocialPosts,
  likeSocialPost,
  updateSocialPost,
} from "../controllers/socialPostsController";
import { requireAuth } from "../middleware/authMiddleware";
import { guestPhotoUpload } from "../middleware/uploadMiddleware";

const router = Router();

router.use(requireAuth);
router.get("/", getPublicSocialPosts);
router.post("/", guestPhotoUpload.single("image"), createSocialPost);
router.patch("/:id", updateSocialPost);
router.patch("/:id/like", likeSocialPost);
router.delete("/:id", deleteOwnSocialPost);

export default router;
