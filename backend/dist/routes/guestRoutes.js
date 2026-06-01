"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guestController_1 = require("../controllers/guestController");
const router = (0, express_1.Router)();
router.get("/search", guestController_1.searchRsvpGuests);
router.post("/", guestController_1.createRsvp);
exports.default = router;
//# sourceMappingURL=guestRoutes.js.map