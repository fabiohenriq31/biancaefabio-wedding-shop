import type { Request, Response } from "express";
import { FinancialEntry } from "../model/FinancialEntry";

function sanitizeText(value: unknown, maxLength = 400) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function parseAmount(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

export async function getAdminFinanceEntries(_req: Request, res: Response) {
  try {
    const entries = await FinancialEntry.find().sort({ savedAt: -1, createdAt: -1 });
    return res.json(entries);
  } catch (error) {
    console.error("Erro ao buscar reservas financeiras:", error);
    return res.status(500).json({ message: "Erro ao buscar reservas financeiras." });
  }
}

export async function createAdminFinanceEntry(req: Request, res: Response) {
  try {
    const amount = parseAmount(req.body.amount);

    if (amount <= 0) {
      return res.status(400).json({ message: "Informe um valor maior que zero." });
    }

    const entry = await FinancialEntry.create({
      amount,
      note: sanitizeText(req.body.note, 240),
      savedAt: req.body.savedAt ? new Date(req.body.savedAt) : new Date(),
    });

    return res.status(201).json(entry);
  } catch (error) {
    console.error("Erro ao registrar reserva financeira:", error);
    return res.status(500).json({ message: "Erro ao registrar reserva financeira." });
  }
}

export async function deleteAdminFinanceEntry(req: Request, res: Response) {
  try {
    const entry = await FinancialEntry.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Reserva financeira não encontrada." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao remover reserva financeira:", error);
    return res.status(500).json({ message: "Erro ao remover reserva financeira." });
  }
}
