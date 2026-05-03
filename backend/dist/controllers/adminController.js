"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSummary = getAdminSummary;
const GuestPhoto_1 = require("../model/GuestPhoto");
const Guest_1 = require("../model/Guest");
const Order_1 = require("../model/Order");
const Product_1 = require("../model/Product");
async function getAdminSummary(_req, res) {
    try {
        const [activeProducts, totalOrders, totalPhotos, hiddenPhotos, totalGuests, confirmedGuests, notConfirmedGuests, latestPhotos, latestOrders, latestGuests,] = await Promise.all([
            Product_1.Product.countDocuments({ isActive: true }),
            Order_1.Order.countDocuments(),
            GuestPhoto_1.GuestPhoto.countDocuments(),
            GuestPhoto_1.GuestPhoto.countDocuments({ status: "hidden" }),
            Guest_1.Guest.countDocuments(),
            Guest_1.Guest.countDocuments({ status: "confirmed" }),
            Guest_1.Guest.countDocuments({ status: "not_confirmed" }),
            GuestPhoto_1.GuestPhoto.find().sort({ createdAt: -1 }).limit(6),
            Order_1.Order.find().sort({ createdAt: -1 }).limit(6),
            Guest_1.Guest.find().sort({ createdAt: -1 }).limit(6),
        ]);
        return res.json({
            activeProducts,
            totalOrders,
            totalPhotos,
            hiddenPhotos,
            totalGuests,
            confirmedGuests,
            notConfirmedGuests,
            latestPhotos,
            latestOrders,
            latestGuests,
        });
    }
    catch (error) {
        console.error("Erro ao buscar resumo administrativo:", error);
        return res.status(500).json({ message: "Erro ao buscar resumo." });
    }
}
//# sourceMappingURL=adminController.js.map