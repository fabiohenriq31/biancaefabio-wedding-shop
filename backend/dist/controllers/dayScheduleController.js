"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDaySchedule = getAdminDaySchedule;
exports.createAdminDayScheduleItem = createAdminDayScheduleItem;
exports.updateAdminDayScheduleItem = updateAdminDayScheduleItem;
exports.deleteAdminDayScheduleItem = deleteAdminDayScheduleItem;
const DayScheduleItem_1 = require("../model/DayScheduleItem");
function sanitizeText(value, maxLength = 300) {
    return String(value || "")
        .replace(/[<>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}
function parseDayKey(value) {
    return value === "friday" || value === "saturday" || value === "sunday"
        ? value
        : "friday";
}
function parseTime(value) {
    const time = sanitizeText(value, 5);
    return /^\d{2}:\d{2}$/.test(time) ? time : "";
}
async function getAdminDaySchedule(_req, res) {
    try {
        const items = await DayScheduleItem_1.DayScheduleItem.find().sort({ dayKey: 1, startTime: 1, createdAt: 1 });
        return res.json(items);
    }
    catch (error) {
        console.error("Erro ao buscar organizacao do dia:", error);
        return res.status(500).json({ message: "Erro ao buscar organizacao do dia." });
    }
}
async function createAdminDayScheduleItem(req, res) {
    try {
        const title = sanitizeText(req.body.title, 140);
        const startTime = parseTime(req.body.startTime);
        if (!title || !startTime) {
            return res.status(400).json({ message: "Titulo e horario inicial sao obrigatorios." });
        }
        const item = await DayScheduleItem_1.DayScheduleItem.create({
            dayKey: parseDayKey(req.body.dayKey),
            startTime,
            endTime: parseTime(req.body.endTime),
            title,
            location: sanitizeText(req.body.location, 140),
            notes: sanitizeText(req.body.notes, 800),
        });
        return res.status(201).json(item);
    }
    catch (error) {
        console.error("Erro ao criar organizacao do dia:", error);
        return res.status(500).json({ message: "Erro ao criar organizacao do dia." });
    }
}
async function updateAdminDayScheduleItem(req, res) {
    try {
        const title = sanitizeText(req.body.title, 140);
        const startTime = parseTime(req.body.startTime);
        if (!title || !startTime) {
            return res.status(400).json({ message: "Titulo e horario inicial sao obrigatorios." });
        }
        const item = await DayScheduleItem_1.DayScheduleItem.findByIdAndUpdate(req.params.id, {
            dayKey: parseDayKey(req.body.dayKey),
            startTime,
            endTime: parseTime(req.body.endTime),
            title,
            location: sanitizeText(req.body.location, 140),
            notes: sanitizeText(req.body.notes, 800),
        }, { new: true });
        if (!item) {
            return res.status(404).json({ message: "Compromisso nao encontrado." });
        }
        return res.json(item);
    }
    catch (error) {
        console.error("Erro ao atualizar organizacao do dia:", error);
        return res.status(500).json({ message: "Erro ao atualizar organizacao do dia." });
    }
}
async function deleteAdminDayScheduleItem(req, res) {
    try {
        const item = await DayScheduleItem_1.DayScheduleItem.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Compromisso nao encontrado." });
        }
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao remover organizacao do dia:", error);
        return res.status(500).json({ message: "Erro ao remover organizacao do dia." });
    }
}
//# sourceMappingURL=dayScheduleController.js.map