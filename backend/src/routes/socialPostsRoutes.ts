import { Router } from "express";
import {
  commentSocialPost,
  createSocialPost,
  deleteOwnSocialPost,
  getPublicSocialPosts,
  likeSocialPost,
  repostSocialPost,
  updateSocialPost,
} from "../controllers/socialPostsController";
import { requireAuth } from "../middleware/authMiddleware";
import { guestPhotoUpload } from "../middleware/uploadMiddleware";

const router = Router();

router.use(requireAuth);
router.get("/", getPublicSocialPosts);
router.post("/", guestPhotoUpload.fields([
  { name: "images", maxCount: 10 },
  { name: "image", maxCount: 10 },
]), createSocialPost);
router.patch("/:id", updateSocialPost);
router.patch("/:id/like", likeSocialPost);
router.patch("/:id/repost", repostSocialPost);
router.post("/:id/comments", commentSocialPost);
router.delete("/:id", deleteOwnSocialPost);

export default router;
