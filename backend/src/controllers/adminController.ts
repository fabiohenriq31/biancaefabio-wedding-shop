import type { Request, Response } from "express";
import { GuestPhoto } from "../model/GuestPhoto";
import { Guest } from "../model/Guest";
import { Order } from "../model/Order";
import { Product } from "../model/Product";

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
      GuestPhoto.find().sort({ createdAt: -1 }).limit(6),
      Order.find().sort({ createdAt: -1 }).limit(6),
      Guest.find().sort({ createdAt: -1 }).limit(6),
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
  } catch (error) {
    console.error("Erro ao buscar resumo administrativo:", error);
    return res.status(500).json({ message: "Erro ao buscar resumo." });
  }
}
