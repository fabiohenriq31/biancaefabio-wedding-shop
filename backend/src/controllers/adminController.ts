import type { Request, Response } from "express";
import { GuestPhoto } from "../model/GuestPhoto";
import { Guest } from "../model/Guest";
import { Order } from "../model/Order";
import { Product } from "../model/Product";
import { Supplier } from "../model/Supplier";
import { FinancialEntry } from "../model/FinancialEntry";

function getSupplierTotals(suppliers: any[]) {
  return suppliers.reduce(
    (totals, supplier) => {
      const paid = (supplier.payments || []).reduce(
        (sum: number, payment: any) => sum + Number(payment.amount || 0),
        0
      );
      const staffCount = Number(supplier.staffCount || 0);

      totals.totalCost += Number(supplier.totalCost || 0);
      totals.totalPaid += paid;
      totals.totalStaff += staffCount;
      totals.staffMealCost += staffCount * 45;
      return totals;
    },
    { totalCost: 0, totalPaid: 0, totalStaff: 0, staffMealCost: 0 }
  );
}

export async function getAdminSummary(_req: Request, res: Response) {
  try {
    const [
      activeProducts,
      totalOrders,
      totalPhotos,
      hiddenPhotos,
      totalGuests,
      confirmedGuests,
      groomsmenGuests,
      regularGuests,
      childGuests,
      payingGuests,
      suppliers,
      financeEntries,
      latestPhotos,
      latestOrders,
      latestGuests,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      GuestPhoto.countDocuments(),
      GuestPhoto.countDocuments({ status: "hidden" }),
      Guest.countDocuments(),
      Guest.countDocuments({
        $or: [{ status: "confirmed" }, { isAttending: true }],
      }),
      Guest.countDocuments({ guestType: "groomsman" }),
      Guest.countDocuments({ guestType: "guest" }),
      Guest.countDocuments({ isChild: true }),
      Guest.countDocuments({ isChild: false }),
      Supplier.find().sort({ createdAt: -1 }),
      FinancialEntry.find().sort({ savedAt: -1, createdAt: -1 }),
      GuestPhoto.find().sort({ createdAt: -1 }).limit(6),
      Order.find().sort({ createdAt: -1 }).limit(6),
      Guest.find().sort({ createdAt: -1 }).limit(6),
    ]);
    const supplierTotals = getSupplierTotals(suppliers);
    const totalReserved = financeEntries.reduce(
      (sum, entry) => sum + Number(entry.amount || 0),
      0
    );
    const confirmedPayingGuests = await Guest.countDocuments({
      isChild: false,
      $or: [{ status: "confirmed" }, { isAttending: true }],
    });
    const notConfirmedGuests = Math.max(totalGuests - confirmedGuests, 0);
    const supplierTotalPending = Math.max(
      supplierTotals.totalCost - supplierTotals.totalPaid,
      0
    );
    const remainingToSave = Math.max(supplierTotalPending - totalReserved, 0);

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
      financialReserveTotal: totalReserved,
      remainingToSave,
      totalSuppliers: suppliers.length,
      supplierTotalStaff: supplierTotals.totalStaff,
      supplierStaffMealCost: supplierTotals.staffMealCost,
      supplierTotalCost: supplierTotals.totalCost,
      supplierTotalPaid: supplierTotals.totalPaid,
      supplierTotalPending,
      latestFinancialEntries: financeEntries.slice(0, 6),
      latestSuppliers: suppliers.slice(0, 6),
      latestPhotos,
      latestOrders,
      latestGuests,
    });
  } catch (error) {
    console.error("Erro ao buscar resumo administrativo:", error);
    return res.status(500).json({ message: "Erro ao buscar resumo." });
  }
}
