import type { Request, Response } from "express";
import { GuestPhoto } from "../model/GuestPhoto";
import { Order } from "../model/Order";
import { Product } from "../model/Product";

export async function getAdminSummary(_req: Request, res: Response) {
  try {
    const [
      activeProducts,
      totalOrders,
      totalPhotos,
      hiddenPhotos,
      latestPhotos,
      latestOrders,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      GuestPhoto.countDocuments(),
      GuestPhoto.countDocuments({ status: "hidden" }),
      GuestPhoto.find().sort({ createdAt: -1 }).limit(6),
      Order.find().sort({ createdAt: -1 }).limit(6),
    ]);

    return res.json({
      activeProducts,
      totalOrders,
      totalPhotos,
      hiddenPhotos,
      latestPhotos,
      latestOrders,
    });
  } catch (error) {
    console.error("Erro ao buscar resumo administrativo:", error);
    return res.status(500).json({ message: "Erro ao buscar resumo." });
  }
}
