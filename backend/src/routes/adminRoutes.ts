import { Router } from "express";
import { getAdminSummary } from "../controllers/adminController";
import {
  confirmGuest,
  createAdminGuest,
  getAdminGuests,
  unconfirmGuest,
} from "../controllers/guestController";
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
} from "../controllers/supplierController";
import { requireAdmin } from "../middleware/adminMiddleware";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/summary", getAdminSummary);
router.get("/guests", getAdminGuests);
router.post("/guests", createAdminGuest);
router.patch("/guests/:id/confirm", confirmGuest);
router.patch("/guests/:id/unconfirm", unconfirmGuest);
router.get("/suppliers", getAdminSuppliers);
router.post("/suppliers", createSupplier);
router.post("/suppliers/:id/payments", addSupplierPayment);
router.delete("/suppliers/:id", removeSupplier);
router.get("/guest-photos", getAdminGuestPhotos);
router.patch("/guest-photos/:id/hide", hideGuestPhoto);
router.patch("/guest-photos/:id/show", showGuestPhoto);
router.delete("/guest-photos/:id", removeGuestPhoto);

export default router;
