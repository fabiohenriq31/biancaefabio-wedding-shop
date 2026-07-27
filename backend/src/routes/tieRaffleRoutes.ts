import { Router } from "express";
import { getPublicTieRaffleStatus } from "../controllers/tieRaffleController";

const router = Router();

router.get("/", getPublicTieRaffleStatus);

export default router;
