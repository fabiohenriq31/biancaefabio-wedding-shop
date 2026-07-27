"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicTieRaffleStatus = getPublicTieRaffleStatus;
exports.getAdminTieRaffle = getAdminTieRaffle;
exports.searchTieRaffleUsers = searchTieRaffleUsers;
exports.createTieRaffleEntry = createTieRaffleEntry;
exports.deleteTieRaffleEntry = deleteTieRaffleEntry;
exports.drawTieRaffleWinner = drawTieRaffleWinner;
exports.resetTieRaffleWinner = resetTieRaffleWinner;
const crypto_1 = __importDefault(require("crypto"));
const TieRaffleEntry_1 = require("../model/TieRaffleEntry");
const TieRaffleState_1 = require("../model/TieRaffleState");
const User_1 = require("../model/User");
function sanitizeText(value, maxLength = 200) {
    return String(value || "")
        .replace(/[<>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}
function sanitizeEmail(value) {
    return sanitizeText(value, 180).toLowerCase();
}
function normalizeName(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}
function parseAmount(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) {
        return 0;
    }
    return Math.round(amount * 100) / 100;
}
async function getState() {
    return TieRaffleState_1.TieRaffleState.findOne().sort({ updatedAt: -1 });
}
function buildParticipantKey(entry) {
    if (entry.userId) {
        return `user:${String(entry.userId)}`;
    }
    return `name:${normalizeName(entry.fullName)}`;
}
function summarizeEntries(entries) {
    const grouped = new Map();
    const totalAmount = entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    for (const entry of entries) {
        const key = buildParticipantKey(entry);
        const current = grouped.get(key);
        if (current) {
            current.totalAmount += Number(entry.amount || 0);
            current.entriesCount += 1;
            if (!current.email && entry.email) {
                current.email = entry.email;
            }
            continue;
        }
        grouped.set(key, {
            key,
            fullName: entry.fullName,
            email: entry.email || "",
            totalAmount: Number(entry.amount || 0),
            entriesCount: 1,
            userId: entry.userId ? String(entry.userId) : null,
            chancePercent: 0,
        });
    }
    const participants = Array.from(grouped.values())
        .map((participant) => ({
        ...participant,
        totalAmount: Math.round(participant.totalAmount * 100) / 100,
        chancePercent: totalAmount > 0
            ? Math.round((participant.totalAmount / totalAmount) * 10000) / 100
            : 0,
    }))
        .sort((a, b) => b.totalAmount - a.totalAmount || a.fullName.localeCompare(b.fullName, "pt-BR"));
    return {
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalEntries: entries.length,
        participantCount: participants.length,
        participants,
    };
}
function serializeWinner(state) {
    if (!state || state.status !== "drawn" || !state.winnerName) {
        return null;
    }
    return {
        name: state.winnerName,
        email: state.winnerEmail || "",
        totalAmount: Number(state.winnerAmount || 0),
        drawnAt: state.drawnAt,
        drawToken: state.drawToken,
    };
}
async function loadTieRaffleData() {
    const [entries, state] = await Promise.all([
        TieRaffleEntry_1.TieRaffleEntry.find().sort({ createdAt: -1 }),
        getState(),
    ]);
    const summary = summarizeEntries(entries);
    return {
        entries,
        summary,
        state,
    };
}
function pickWinner(participants) {
    const weightedPool = participants.map((participant) => ({
        ...participant,
        weight: Math.max(1, Math.round(participant.totalAmount * 100)),
    }));
    const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) {
        return null;
    }
    let target = Math.floor(Math.random() * totalWeight);
    for (const participant of weightedPool) {
        target -= participant.weight;
        if (target < 0) {
            return participant;
        }
    }
    return weightedPool[weightedPool.length - 1] || null;
}
async function getPublicTieRaffleStatus(_req, res) {
    try {
        const { entries, summary, state } = await loadTieRaffleData();
        return res.json({
            totalAmount: summary.totalAmount,
            totalEntries: summary.totalEntries,
            participantCount: summary.participantCount,
            topParticipants: summary.participants.slice(0, 10),
            recentEntries: entries.slice(0, 10).map((entry) => ({
                _id: entry._id,
                fullName: entry.fullName,
                amount: entry.amount,
                createdAt: entry.createdAt,
            })),
            winner: serializeWinner(state),
            updatedAt: state?.updatedAt || entries[0]?.createdAt || null,
        });
    }
    catch (error) {
        console.error("Erro ao buscar status da gravata:", error);
        return res.status(500).json({ message: "Erro ao buscar dados da gravata." });
    }
}
async function getAdminTieRaffle(req, res) {
    try {
        const query = sanitizeText(req.query.q, 120).toLowerCase();
        const { entries, summary, state } = await loadTieRaffleData();
        const filteredEntries = query
            ? entries.filter((entry) => {
                const haystack = `${entry.fullName} ${entry.email || ""}`.toLowerCase();
                return haystack.includes(query);
            })
            : entries;
        return res.json({
            entries: filteredEntries.map((entry) => ({
                _id: entry._id,
                fullName: entry.fullName,
                email: entry.email || "",
                amount: Number(entry.amount || 0),
                note: entry.note || "",
                userId: entry.userId ? String(entry.userId) : null,
                createdByAdminId: entry.createdByAdminId || "",
                createdByAdminName: entry.createdByAdminName || "",
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
            })),
            summary,
            winner: serializeWinner(state),
        });
    }
    catch (error) {
        console.error("Erro ao buscar dados administrativos da gravata:", error);
        return res.status(500).json({ message: "Erro ao buscar dados da gravata." });
    }
}
async function searchTieRaffleUsers(req, res) {
    try {
        const q = sanitizeText(req.query.q, 120);
        if (q.length < 2) {
            return res.json([]);
        }
        const users = await User_1.User.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(8);
        return res.json(users.map((user) => ({
            id: String(user._id),
            name: user.name,
            email: user.email,
        })));
    }
    catch (error) {
        console.error("Erro ao buscar usuarios para a gravata:", error);
        return res.status(500).json({ message: "Erro ao buscar usuarios cadastrados." });
    }
}
async function createTieRaffleEntry(req, res) {
    try {
        const userId = sanitizeText(req.body.userId, 60);
        const typedName = sanitizeText(req.body.fullName, 160);
        const amount = parseAmount(req.body.amount);
        const note = sanitizeText(req.body.note, 300);
        if (amount <= 0) {
            return res.status(400).json({ message: "Informe um valor maior que zero." });
        }
        let linkedUser = null;
        if (userId) {
            linkedUser = await User_1.User.findById(userId);
            if (!linkedUser) {
                return res.status(404).json({ message: "Usuario cadastrado nao encontrado." });
            }
        }
        const fullName = typedName || linkedUser?.name || "";
        if (!fullName) {
            return res.status(400).json({ message: "Informe o nome completo para a hora da gravata." });
        }
        const entry = await TieRaffleEntry_1.TieRaffleEntry.create({
            userId: linkedUser?._id || null,
            fullName,
            email: linkedUser?.email || sanitizeEmail(req.body.email),
            amount,
            note,
            createdByAdminId: req.user?.sub || "",
            createdByAdminName: req.user?.name || "",
        });
        return res.status(201).json(entry);
    }
    catch (error) {
        console.error("Erro ao criar entrada da gravata:", error);
        return res.status(500).json({ message: "Erro ao registrar valor da gravata." });
    }
}
async function deleteTieRaffleEntry(req, res) {
    try {
        const entry = await TieRaffleEntry_1.TieRaffleEntry.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: "Lancamento da gravata nao encontrado." });
        }
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao remover entrada da gravata:", error);
        return res.status(500).json({ message: "Erro ao remover valor da gravata." });
    }
}
async function drawTieRaffleWinner(_req, res) {
    try {
        const { summary } = await loadTieRaffleData();
        if (summary.participants.length === 0) {
            return res.status(400).json({ message: "Cadastre pelo menos uma entrada antes de sortear." });
        }
        const winner = pickWinner(summary.participants);
        if (!winner) {
            return res.status(400).json({ message: "Nao foi possivel calcular o vencedor." });
        }
        const drawToken = `${Date.now()}-${crypto_1.default.randomUUID()}`;
        const state = await TieRaffleState_1.TieRaffleState.findOneAndUpdate({}, {
            $set: {
                status: "drawn",
                winnerParticipantKey: winner.key,
                winnerName: winner.fullName,
                winnerEmail: winner.email,
                winnerUserId: winner.userId || null,
                winnerAmount: winner.totalAmount,
                drawnAt: new Date(),
                drawToken,
            },
        }, {
            new: true,
            upsert: true,
        });
        return res.json({
            winner: serializeWinner(state),
        });
    }
    catch (error) {
        console.error("Erro ao sortear a gravata:", error);
        return res.status(500).json({ message: "Erro ao realizar o sorteio da gravata." });
    }
}
async function resetTieRaffleWinner(_req, res) {
    try {
        const state = await TieRaffleState_1.TieRaffleState.findOneAndUpdate({}, {
            $set: {
                status: "idle",
                winnerParticipantKey: "",
                winnerName: "",
                winnerEmail: "",
                winnerUserId: null,
                winnerAmount: 0,
                drawToken: "",
                drawnAt: null,
            },
        }, {
            new: true,
            upsert: true,
        });
        return res.json({
            winner: serializeWinner(state),
        });
    }
    catch (error) {
        console.error("Erro ao reiniciar sorteio da gravata:", error);
        return res.status(500).json({ message: "Erro ao reiniciar sorteio da gravata." });
    }
}
//# sourceMappingURL=tieRaffleController.js.map