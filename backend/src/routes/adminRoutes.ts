import { Router } from "express";
import { getAdminSummary } from "../controllers/adminController";
import {
  createAdminDayScheduleItem,
  deleteAdminDayScheduleItem,
  getAdminDaySchedule,
  updateAdminDayScheduleItem,
} from "../controllers/dayScheduleController";
import {
  createAdminFinanceEntry,
  deleteAdminFinanceEntry,
  getAdminFinanceEntries,
} from "../controllers/adminFinanceController";
import {
  confirmGuest,
  createAdminGuest,
  deleteGuest,
  getAdminGuests,
  unconfirmGuest,
  updateGuest,
} from "../controllers/guestController";
import {
  getAdminGuestCleanupSetting,
  updateAdminGuestCleanupSetting,
} from "../controllers/guestCleanupController";
import {
  getAdminGuestPhotos,
  hideGuestPhoto,
  removeGuestPhoto,
  showGuestPhoto,
} from "../controllers/guestPhotosController";
import {
  addSupplierPayment,
  createSupplier,
  getAdminSuppliers,
  removeSupplier,
  updateSupplier,
} from "../controllers/supplierController";
import {
  getAdminSocialPosts,
  hideSocialPost,
  removeSocialPost,
  showSocialPost,
} from "../controllers/socialPostsController";
import {
  createTieRaffleEntry,
  deleteTieRaffleEntry,
  drawTieRaffleWinner,
  getAdminTieRaffle,
  resetTieRaffleWinner,
  searchTieRaffleUsers,
} from "../controllers/tieRaffleController";
import { requireAdmin } from "../middleware/adminMiddleware";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/summary", getAdminSummary);
router.get("/guests", getAdminGuests);
router.post("/guests", createAdminGuest);
router.patch("/guests/:id", updateGuest);
router.patch("/guests/:id/confirm", confirmGuest);
router.patch("/guests/:id/unconfirm", unconfirmGuest);
router.delete("/guests/:id", deleteGuest);
router.get("/guests/cleanup-settings", getAdminGuestCleanupSetting);
router.put("/guests/cleanup-settings", updateAdminGuestCleanupSetting);
router.get("/day-schedule", getAdminDaySchedule);
router.post("/day-schedule", createAdminDayScheduleItem);
router.patch("/day-schedule/:id", updateAdminDayScheduleItem);
router.delete("/day-schedule/:id", deleteAdminDayScheduleItem);
router.get("/suppliers", getAdminSuppliers);
router.post("/suppliers", createSupplier);
router.patch("/suppliers/:id", updateSupplier);
router.post("/suppliers/:id/payments", addSupplierPayment);
router.delete("/suppliers/:id", removeSupplier);
router.get("/finance", getAdminFinanceEntries);
router.post("/finance", createAdminFinanceEntry);
router.delete("/finance/:id", deleteAdminFinanceEntry);
router.get("/tie-raffle", getAdminTieRaffle);
router.get("/tie-raffle/users/search", searchTieRaffleUsers);
router.post("/tie-raffle/entries", createTieRaffleEntry);
router.delete("/tie-raffle/entries/:id", deleteTieRaffleEntry);
router.post("/tie-raffle/draw", drawTieRaffleWinner);
router.post("/tie-raffle/reset", resetTieRaffleWinner);
router.get("/guest-photos", getAdminGuestPhotos);
router.patch("/guest-photos/:id/hide", hideGuestPhoto);
router.patch("/guest-photos/:id/show", showGuestPhoto);
router.delete("/guest-photos/:id", removeGuestPhoto);
router.get("/social-posts", getAdminSocialPosts);
router.patch("/social-posts/:id/hide", hideSocialPost);
router.patch("/social-posts/:id/show", showSocialPost);
router.delete("/social-posts/:id", removeSocialPost);

export default router;
