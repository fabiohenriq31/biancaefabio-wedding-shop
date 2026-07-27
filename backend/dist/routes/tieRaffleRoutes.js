"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tieRaffleController_1 = require("../controllers/tieRaffleController");
const router = (0, express_1.Router)();
router.get("/", tieRaffleController_1.getPublicTieRaffleStatus);
exports.default = router;
//# sourceMappingURL=tieRaffleRoutes.js.map