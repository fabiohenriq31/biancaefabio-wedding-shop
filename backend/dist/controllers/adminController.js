"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSummary = getAdminSummary;
const GuestPhoto_1 = require("../model/GuestPhoto");
const Guest_1 = require("../model/Guest");
const Order_1 = require("../model/Order");
const Product_1 = require("../model/Product");
const Supplier_1 = require("../model/Supplier");
function getSupplierTotals(suppliers) {
    return suppliers.reduce((totals, supplier) => {
        const paid = (supplier.payments || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
        const staffCount = Number(supplier.staffCount || 0);
        totals.totalCost += Number(supplier.totalCost || 0);
        totals.totalPaid += paid;
        totals.totalStaff += staffCount;
        totals.staffMealCost += staffCount * 45;
        return totals;
    }, { totalCost: 0, totalPaid: 0, totalStaff: 0, staffMealCost: 0 });
}
async function getAdminSummary(_req, res) {
    try {
        const [activeProducts, totalOrders, totalPhotos, hiddenPhotos, totalGuests, confirmedGuests, notConfirmedGuests, groomsmenGuests, regularGuests, childGuests, payingGuests, confirmedPayingGuests, suppliers, latestPhotos, latestOrders, latestGuests,] = await Promise.all([
            Product_1.Product.countDocuments({ isActive: true }),
            Order_1.Order.countDocuments(),
            GuestPhoto_1.GuestPhoto.countDocuments(),
            GuestPhoto_1.GuestPhoto.countDocuments({ status: "hidden" }),
            Guest_1.Guest.countDocuments(),
            Guest_1.Guest.countDocuments({ status: "confirmed" }),
            Guest_1.Guest.countDocuments({ status: "not_confirmed" }),
            Guest_1.Guest.countDocuments({ guestType: "groomsman" }),
            Guest_1.Guest.countDocuments({ guestType: "guest" }),
            Guest_1.Guest.countDocuments({ isChild: true }),
            Guest_1.Guest.countDocuments({ isChild: false }),
            Guest_1.Guest.countDocuments({ isChild: false, status: "confirmed" }),
            Supplier_1.Supplier.find().sort({ createdAt: -1 }),
            GuestPhoto_1.GuestPhoto.find().sort({ createdAt: -1 }).limit(6),
            Order_1.Order.find().sort({ createdAt: -1 }).limit(6),
            Guest_1.Guest.find().sort({ createdAt: -1 }).limit(6),
        ]);
        const supplierTotals = getSupplierTotals(suppliers);
        return res.json({
            activeProducts,
            totalOrders,
            totalPhotos,
            hiddenPhotos,
            totalGuests,
            confirmedGuests,
            notConfirmedGuests,
            groomsmenGuests,
            regularGuests,
            childGuests,
            payingGuests,
            confirmedPayingGuests,
            totalSuppliers: suppliers.length,
            supplierTotalStaff: supplierTotals.totalStaff,
            supplierStaffMealCost: supplierTotals.staffMealCost,
            supplierTotalCost: supplierTotals.totalCost,
            supplierTotalPaid: supplierTotals.totalPaid,
            supplierTotalPending: Math.max(supplierTotals.totalCost - supplierTotals.totalPaid, 0),
            latestSuppliers: suppliers.slice(0, 6),
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