import type { Request, Response } from "express";
import { applyScheduledGuestCleanup, getGuestCleanupSetting } from "../services/guestCleanup.service";

function parseExecuteAt(value: unknown) {
  const raw = String(value || "").trim();

  if (!raw) {
    return null;
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export async function getAdminGuestCleanupSetting(_req: Request, res: Response) {
  try {
    await applyScheduledGuestCleanup();
    const setting = await getGuestCleanupSetting();

    return res.json({
      enabled: setting.enabled,
      executeAt: setting.executeAt,
      lastExecutedAt: setting.lastExecutedAt,
      lastDeletedCount: setting.lastDeletedCount || 0,
      updatedAt: setting.updatedAt,
    });
  } catch (error) {
    console.error("Erro ao buscar configuracao de limpeza de convidados:", error);
    return res.status(500).json({ message: "Erro ao buscar configuracao de exclusao automatica." });
  }
}

export async function updateAdminGuestCleanupSetting(req: Request, res: Response) {
  try {
    const setting = await getGuestCleanupSetting();
    const enabled = req.body.enabled === true || req.body.enabled === "true";
    const executeAt = parseExecuteAt(req.body.executeAt);

    if (enabled && !executeAt) {
      return res.status(400).json({ message: "Informe uma data valida para excluir os nao confirmados." });
    }

    setting.enabled = enabled;
    setting.executeAt = enabled ? executeAt : null;

    if (!enabled) {
      setting.lastDeletedCount = 0;
    }

    await setting.save();

    return res.json({
      enabled: setting.enabled,
      executeAt: setting.executeAt,
      lastExecutedAt: setting.lastExecutedAt,
      lastDeletedCount: setting.lastDeletedCount || 0,
      updatedAt: setting.updatedAt,
    });
  } catch (error) {
    console.error("Erro ao salvar configuracao de limpeza de convidados:", error);
    return res.status(500).json({ message: "Erro ao salvar configuracao de exclusao automatica." });
  }
}
