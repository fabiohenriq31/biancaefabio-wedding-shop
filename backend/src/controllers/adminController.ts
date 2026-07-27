import type { Request, Response } from "express";
import { GuestPhoto } from "../model/GuestPhoto";
import { Guest } from "../model/Guest";
import { Order } from "../model/Order";
import { Product } from "../model/Product";
import { Supplier } from "../model/Supplier";
import { FinancialEntry } from "../model/FinancialEntry";
import { SocialPost } from "../model/SocialPost";
import { TieRaffleEntry } from "../model/TieRaffleEntry";
import { TieRaffleState } from "../model/TieRaffleState";

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
      totalSocialPosts,
      hiddenSocialPosts,
      suppliers,
      financeEntries,
      latestPhotos,
      latestSocialPosts,
      latestOrders,
      latestGuests,
      tieRaffleEntries,
      tieRaffleState,
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
      SocialPost.countDocuments(),
      SocialPost.countDocuments({ status: "hidden" }),
      Supplier.find().sort({ createdAt: -1 }),
      FinancialEntry.find().sort({ savedAt: -1, createdAt: -1 }),
      GuestPhoto.find().sort({ createdAt: -1 }).limit(6),
      SocialPost.find().sort({ createdAt: -1 }).limit(6),
      Order.find().sort({ createdAt: -1 }).limit(6),
      Guest.find().sort({ createdAt: -1 }).limit(6),
      TieRaffleEntry.find().sort({ createdAt: -1 }),
      TieRaffleState.findOne().sort({ updatedAt: -1 }),
    ]);
    const tieRaffleSummary = tieRaffleEntries.reduce(
      (acc, entry) => {
        acc.totalAmount += Number(entry.amount || 0);
        const key = entry.userId ? `user:${String(entry.userId)}` : `name:${String(entry.fullName || "").toLowerCase()}`;
        acc.participants.add(key);
        return acc;
      },
      {
        totalAmount: 0,
        participants: new Set<string>(),
      }
    );

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
      totalSocialPosts,
      hiddenSocialPosts,
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
      latestSocialPosts,
      latestOrders,
      latestGuests,
      tieRaffleEntryCount: tieRaffleEntries.length,
      tieRaffleParticipantCount: tieRaffleSummary.participants.size,
      tieRaffleTotalAmount: Math.round(tieRaffleSummary.totalAmount * 100) / 100,
      tieRaffleWinnerName: tieRaffleState?.winnerName || "",
    });
  } catch (error) {
    console.error("Erro ao buscar resumo administrativo:", error);
    return res.status(500).json({ message: "Erro ao buscar resumo." });
  }
}
