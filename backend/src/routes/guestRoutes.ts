import { Router } from "express";
import { createRsvp, searchRsvpGuests } from "../controllers/guestController";

const router = Router();

router.get("/search", searchRsvpGuests);
router.post("/", createRsvp);

export default router;
