import type { Request, Response } from "express";
import { GuestPhoto } from "../model/GuestPhoto";
import { Guest } from "../model/Guest";
import { Order } from "../model/Order";
import { Product } from "../model/Product";
import { Supplier } from "../model/Supplier";

function getSupplierTotals(suppliers: any[]) {
  return suppliers.reduce(
    (totals, supplier) => {
      const paid = (supplier.payments || []).reduce(
        (sum: number, payment: any) => sum + Number(payment.amount || 0),
        0
      );

      totals.totalCost += Number(supplier.totalCost || 0);
      totals.totalPaid += paid;
      return totals;
    },
    { totalCost: 0, totalPaid: 0 }
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
      notConfirmedGuests,
      groomsmenGuests,
      regularGuests,
      childGuests,
      payingGuests,
      confirmedPayingGuests,
      suppliers,
      latestPhotos,
      latestOrders,
      latestGuests,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      GuestPhoto.countDocuments(),
      GuestPhoto.countDocuments({ status: "hidden" }),
      Guest.countDocuments(),
      Guest.countDocuments({ status: "confirmed" }),
      Guest.countDocuments({ status: "not_confirmed" }),
      Guest.countDocuments({ guestType: "groomsman" }),
      Guest.countDocuments({ guestType: "guest" }),
      Guest.countDocuments({ isChild: true }),
      Guest.countDocuments({ isChild: false }),
      Guest.countDocuments({ isChild: false, status: "confirmed" }),
      Supplier.find().sort({ createdAt: -1 }),
      GuestPhoto.find().sort({ createdAt: -1 }).limit(6),
      Order.find().sort({ createdAt: -1 }).limit(6),
      Guest.find().sort({ createdAt: -1 }).limit(6),
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
      supplierTotalCost: supplierTotals.totalCost,
      supplierTotalPaid: supplierTotals.totalPaid,
      supplierTotalPending: Math.max(supplierTotals.totalCost - supplierTotals.totalPaid, 0),
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
