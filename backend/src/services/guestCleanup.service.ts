import { Guest } from "../model/Guest";
import { GuestCleanupSetting } from "../model/GuestCleanupSetting";

let cleanupPromise: Promise<{ executed: boolean; deletedCount: number }> | null = null;

export async function getGuestCleanupSetting() {
  let setting = await GuestCleanupSetting.findOne().sort({ updatedAt: -1 });

  if (!setting) {
    setting = await GuestCleanupSetting.create({
      enabled: false,
      executeAt: null,
      lastExecutedAt: null,
      lastDeletedCount: 0,
    });
  }

  return setting;
}

export async function applyScheduledGuestCleanup() {
  if (cleanupPromise) {
    return cleanupPromise;
  }

  cleanupPromise = (async () => {
    const setting = await getGuestCleanupSetting();

    if (!setting.enabled || !setting.executeAt) {
      return { executed: false, deletedCount: 0 };
    }

    const now = new Date();
    if (setting.executeAt.getTime() > now.getTime()) {
      return { executed: false, deletedCount: 0 };
    }

    const result = await Guest.deleteMany({ status: "not_confirmed" });
    const deletedCount = Number(result.deletedCount || 0);

    setting.enabled = false;
    setting.lastExecutedAt = now;
    setting.lastDeletedCount = deletedCount;
    await setting.save();

    return { executed: true, deletedCount };
  })();

  try {
    return await cleanupPromise;
  } finally {
    cleanupPromise = null;
  }
}
