import { Router } from "express";
import { createRsvp } from "../controllers/guestController";

const router = Router();

router.post("/", createRsvp);

export default router;
