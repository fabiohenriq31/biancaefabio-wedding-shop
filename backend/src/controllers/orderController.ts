import type { Request, Response } from "express";
import { Order } from "../model/Order";

export async function createOrder(req: Request, res: Response) {
  try {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      giftMessage,
      items,
      paymentMethod,
    } = req.body;

    if (!userId || !customerName || !customerEmail || !items || !items.length) {
      return res.status(400).json({ message: "Dados do pedido incompletos." });
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId,
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      giftMessage: giftMessage || "",
      items,
      totalAmount,
      paymentMethod: paymentMethod || "payment_link",
      status: "pending",
      paymentStatus: "awaiting_payment",
    });

    return res.status(201).json({
      message: "Pedido criado com sucesso.",
      order,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ message: "Erro ao criar pedido." });
  }
}

export async function getOrdersByUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;

    if (!req.user?.sub) {
      return res.status(401).json({ message: "Não autorizado." });
    }

    if (req.user.sub !== userId) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    return res.status(500).json({ message: "Erro ao buscar pedidos." });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    if (!req.user?.sub) {
      return res.status(401).json({ message: "Não autorizado." });
    }

    if (req.user.role !== "admin" && req.user.sub !== order.userId) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    return res.json(order);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return res.status(500).json({ message: "Erro ao buscar pedido." });
  }
}

export async function getAllOrders(_req: Request, res: Response) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar todos os pedidos:", error);
    return res.status(500).json({ message: "Erro ao buscar pedidos." });
  }
}
