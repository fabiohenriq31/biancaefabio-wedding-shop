"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuestCleanupSetting = getGuestCleanupSetting;
exports.applyScheduledGuestCleanup = applyScheduledGuestCleanup;
const Guest_1 = require("../model/Guest");
const GuestCleanupSetting_1 = require("../model/GuestCleanupSetting");
let cleanupPromise = null;
async function getGuestCleanupSetting() {
    let setting = await GuestCleanupSetting_1.GuestCleanupSetting.findOne().sort({ updatedAt: -1 });
    if (!setting) {
        setting = await GuestCleanupSetting_1.GuestCleanupSetting.create({
            enabled: false,
            executeAt: null,
            lastExecutedAt: null,
            lastDeletedCount: 0,
        });
    }
    return setting;
}
async function applyScheduledGuestCleanup() {
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
        const result = await Guest_1.Guest.deleteMany({ status: "not_confirmed" });
        const deletedCount = Number(result.deletedCount || 0);
        setting.enabled = false;
        setting.lastExecutedAt = now;
        setting.lastDeletedCount = deletedCount;
        await setting.save();
        return { executed: true, deletedCount };
    })();
    try {
        return await cleanupPromise;
    }
    finally {
        cleanupPromise = null;
    }
}
//# sourceMappingURL=guestCleanup.service.js.map