import { Request, Response } from "express";
import { Product } from "../model/Product";

export async function getProducts(_req: Request, res: Response) {
  try {
    const products = await Product.find({ isActive: true }).sort({
      displayOrder: 1,
      createdAt: 1,
    });

    return res.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return res.status(500).json({ message: "Erro ao buscar produtos" });
  }
}