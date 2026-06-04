"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRsvpGuests = searchRsvpGuests;
exports.createRsvp = createRsvp;
exports.getAdminGuests = getAdminGuests;
exports.createAdminGuest = createAdminGuest;
exports.confirmGuest = confirmGuest;
exports.updateGuest = updateGuest;
exports.unconfirmGuest = unconfirmGuest;
exports.deleteGuest = deleteGuest;
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
function parseIsChild(value) {
    return value === true || value === "true" || value === "on";
}
function normalizeName(value) {
    return sanitizeText(value, 120)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}
async function resolvePrimaryGuest(body) {
    if (body.primaryGuestId) {
        return Guest_1.Guest.findById(String(body.primaryGuestId));
    }
    const normalized = normalizeName(body.name);
    if (!normalized) {
        return null;
    }
    const guests = await Guest_1.Guest.find();
    return guests.find((guest) => normalizeName(guest.name) === normalized) || null;
}
function parseCompanionIds(value) {
    if (!Array.isArray(value))
        return [];
    return value
        .map((item) => String(item || "").trim())
        .filter(Boolean);
}
async function searchRsvpGuests(req, res) {
    try {
        const q = sanitizeText(req.query.q, 120);
        if (q.length < 2) {
            return res.json([]);
        }
        const guests = await Guest_1.Guest.find({
            name: { $regex: q, $options: "i" },
        })
            .sort({ name: 1 })
            .limit(8);
        return res.json(guests.map((guest) => ({
            _id: guest._id,
            name: guest.name,
            guestType: guest.guestType,
            isChild: guest.isChild,
            status: guest.status,
        })));
    }
    catch (error) {
        console.error("Erro ao buscar convidados para RSVP:", error);
        return res.status(500).json({ message: "Erro ao buscar convidados." });
    }
}
async function createRsvp(req, res) {
    try {
        const primaryGuest = await resolvePrimaryGuest(req.body);
        const message = sanitizeText(req.body.message, 800);
        if (!primaryGuest) {
            return res.status(400).json({ message: "Selecione um nome valido da lista de convidados." });
        }
        if (!message) {
            return res.status(400).json({ message: "Mensagem e obrigatoria." });
        }
        const companionIds = parseCompanionIds(req.body.companionGuestIds).filter((id) => id !== String(primaryGuest._id));
        const companions = companionIds.length > 0
            ? await Guest_1.Guest.find({ _id: { $in: companionIds } })
            : [];
        if (companions.length !== companionIds.length) {
            return res.status(400).json({ message: "Todos os acompanhantes precisam estar na lista de convidados." });
        }
        primaryGuest.email = sanitizeText(req.body.email, 180).toLowerCase();
        primaryGuest.phone = sanitizeText(req.body.phone, 40);
        primaryGuest.message = message;
        primaryGuest.companions = companions.map((guest) => guest.name).join(", ");
        primaryGuest.isAttending = true;
        primaryGuest.status = "confirmed";
        await primaryGuest.save();
        if (companions.length > 0) {
            await Guest_1.Guest.updateMany({ _id: { $in: companionIds } }, {
                $set: {
                    isAttending: true,
                    status: "confirmed",
                },
            });
        }
        return res.status(201).json({
            message: "Confirmacao registrada com sucesso.",
            guest: primaryGuest,
            companions,
        });
    }
    catch (error) {
        console.error("Erro ao registrar RSVP:", error);
        return res.status(500).json({ message: "Erro ao registrar confirmacao." });
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
            return res.status(400).json({ message: "Nome e obrigatorio." });
        }
        const status = req.body.status === "not_confirmed" ? "not_confirmed" : "confirmed";
        const guest = await Guest_1.Guest.create({
            name,
            email: sanitizeText(req.body.email, 180).toLowerCase(),
            phone: sanitizeText(req.body.phone, 40),
            companions: sanitizeText(req.body.companions, 400),
            message: sanitizeText(req.body.message, 800),
            guestType: parseGuestType(req.body.guestType),
            isChild: parseIsChild(req.body.isChild),
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
            return res.status(404).json({ message: "Convidado nao encontrado." });
        }
        return res.json(guest);
    }
    catch (error) {
        console.error("Erro ao confirmar convidado:", error);
        return res.status(500).json({ message: "Erro ao confirmar convidado." });
    }
}
async function updateGuest(req, res) {
    try {
        const name = sanitizeText(req.body.name, 120);
        if (!name) {
            return res.status(400).json({ message: "Nome e obrigatorio." });
        }
        const status = req.body.status === "not_confirmed" ? "not_confirmed" : "confirmed";
        const guest = await Guest_1.Guest.findByIdAndUpdate(req.params.id, {
            name,
            email: sanitizeText(req.body.email, 180).toLowerCase(),
            phone: sanitizeText(req.body.phone, 40),
            companions: sanitizeText(req.body.companions, 400),
            message: sanitizeText(req.body.message, 800),
            guestType: parseGuestType(req.body.guestType),
            isChild: parseIsChild(req.body.isChild),
            isAttending: status === "confirmed",
            status,
        }, { new: true });
        if (!guest) {
            return res.status(404).json({ message: "Convidado nao encontrado." });
        }
        return res.json(guest);
    }
    catch (error) {
        console.error("Erro ao atualizar convidado:", error);
        return res.status(500).json({ message: "Erro ao atualizar convidado." });
    }
}
async function unconfirmGuest(req, res) {
    try {
        const guest = await Guest_1.Guest.findByIdAndUpdate(req.params.id, { isAttending: false, status: "not_confirmed" }, { new: true });
        if (!guest) {
            return res.status(404).json({ message: "Convidado nao encontrado." });
        }
        return res.json(guest);
    }
    catch (error) {
        console.error("Erro ao marcar ausencia:", error);
        return res.status(500).json({ message: "Erro ao marcar ausencia." });
    }
}
async function deleteGuest(req, res) {
    try {
        const guest = await Guest_1.Guest.findByIdAndDelete(req.params.id);
        if (!guest) {
            return res.status(404).json({ message: "Convidado nao encontrado." });
        }
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao remover convidado:", error);
        return res.status(500).json({ message: "Erro ao remover convidado." });
    }
}
//# sourceMappingURL=guestController.js.map