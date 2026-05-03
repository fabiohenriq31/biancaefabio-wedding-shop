"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRsvp = createRsvp;
exports.getAdminGuests = getAdminGuests;
exports.createAdminGuest = createAdminGuest;
exports.confirmGuest = confirmGuest;
exports.unconfirmGuest = unconfirmGuest;
const Guest_1 = require("../model/Guest");
function sanitizeText(value, maxLength = 500) {
    return String(value || "")
        .replace(/[<>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}
function parseGuestType(value) {
    return value === "groomsman" ? "groomsman" : "guest";
}
async function createRsvp(req, res) {
    try {
        const name = sanitizeText(req.body.name, 120);
        if (!name) {
            return res.status(400).json({ message: "Nome é obrigatório." });
        }
        const guest = await Guest_1.Guest.create({
            name,
            email: sanitizeText(req.body.email, 180).toLowerCase(),
            companions: sanitizeText(req.body.companions, 400),
            message: sanitizeText(req.body.message, 800),
            guestType: parseGuestType(req.body.guestType),
            isAttending: true,
            status: "confirmed",
        });
        return res.status(201).json({
            message: "Confirmação registrada com sucesso.",
            guest,
        });
    }
    catch (error) {
        console.error("Erro ao registrar RSVP:", error);
        return res.status(500).json({ message: "Erro ao registrar confirmação." });
    }
}
async function getAdminGuests(req, res) {
    try {
        const status = String(req.query.status || "all");
        const filter = status === "confirmed"
            ? { status: "confirmed" }
            : status === "not_confirmed"
                ? { status: "not_confirmed" }
                : {};
        const guests = await Guest_1.Guest.find(filter).sort({ createdAt: -1 });
        return res.json(guests);
    }
    catch (error) {
        console.error("Erro ao buscar convidados:", error);
        return res.status(500).json({ message: "Erro ao buscar convidados." });
    }
}
async function createAdminGuest(req, res) {
    try {
        const name = sanitizeText(req.body.name, 120);
        if (!name) {
            return res.status(400).json({ message: "Nome é obrigatório." });
        }
        const status = req.body.status === "not_confirmed" ? "not_confirmed" : "confirmed";
        const guest = await Guest_1.Guest.create({
            name,
            email: sanitizeText(req.body.email, 180).toLowerCase(),
            companions: sanitizeText(req.body.companions, 400),
            message: sanitizeText(req.body.message, 800),
            guestType: parseGuestType(req.body.guestType),
            isAttending: status === "confirmed",
            status,
        });
        return res.status(201).json(guest);
    }
    catch (error) {
        console.error("Erro ao criar convidado:", error);
        return res.status(500).json({ message: "Erro ao criar convidado." });
    }
}
async function confirmGuest(req, res) {
    try {
        const guest = await Guest_1.Guest.findByIdAndUpdate(req.params.id, { isAttending: true, status: "confirmed" }, { new: true });
        if (!guest) {
            return res.status(404).json({ message: "Convidado não encontrado." });
        }
        return res.json(guest);
    }
    catch (error) {
        console.error("Erro ao confirmar convidado:", error);
        return res.status(500).json({ message: "Erro ao confirmar convidado." });
    }
}
async function unconfirmGuest(req, res) {
    try {
        const guest = await Guest_1.Guest.findByIdAndUpdate(req.params.id, { isAttending: false, status: "not_confirmed" }, { new: true });
        if (!guest) {
            return res.status(404).json({ message: "Convidado não encontrado." });
        }
        return res.json(guest);
    }
    catch (error) {
        console.error("Erro ao marcar ausência:", error);
        return res.status(500).json({ message: "Erro ao marcar ausência." });
    }
}
//# sourceMappingURL=guestController.js.map