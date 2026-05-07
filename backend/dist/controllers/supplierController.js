"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSuppliers = getAdminSuppliers;
exports.createSupplier = createSupplier;
exports.addSupplierPayment = addSupplierPayment;
exports.removeSupplier = removeSupplier;
const Supplier_1 = require("../model/Supplier");
function sanitizeText(value, maxLength = 500) {
    return String(value || "")
        .replace(/[<>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}
function parseAmount(value) {
    const amount = Number(value || 0);
    return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}
function parseCount(value) {
    const count = Number(value || 0);
    return Number.isFinite(count) && count >= 0 ? Math.floor(count) : 0;
}
async function getAdminSuppliers(_req, res) {
    try {
        const suppliers = await Supplier_1.Supplier.find().sort({ createdAt: -1 });
        return res.json(suppliers);
    }
    catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
        return res.status(500).json({ message: "Erro ao buscar fornecedores." });
    }
}
async function createSupplier(req, res) {
    try {
        const name = sanitizeText(req.body.name, 140);
        const totalCost = parseAmount(req.body.totalCost);
        const initialPayment = parseAmount(req.body.initialPayment);
        const staffCount = parseCount(req.body.staffCount);
        if (!name) {
            return res.status(400).json({ message: "Nome do fornecedor é obrigatório." });
        }
        const supplier = await Supplier_1.Supplier.create({
            name,
            totalCost,
            category: sanitizeText(req.body.category, 100),
            contact: sanitizeText(req.body.contact, 180),
            notes: sanitizeText(req.body.notes, 800),
            staffCount,
            payments: initialPayment > 0
                ? [{
                        amount: initialPayment,
                        paidAt: req.body.initialPaidAt ? new Date(req.body.initialPaidAt) : new Date(),
                        note: sanitizeText(req.body.initialPaymentNote, 180),
                    }]
                : [],
        });
        return res.status(201).json(supplier);
    }
    catch (error) {
        console.error("Erro ao criar fornecedor:", error);
        return res.status(500).json({ message: "Erro ao criar fornecedor." });
    }
}
async function addSupplierPayment(req, res) {
    try {
        const amount = parseAmount(req.body.amount);
        if (amount <= 0) {
            return res.status(400).json({ message: "Informe um valor pago maior que zero." });
        }
        const supplier = await Supplier_1.Supplier.findByIdAndUpdate(req.params.id, {
            $push: {
                payments: {
                    amount,
                    paidAt: req.body.paidAt ? new Date(req.body.paidAt) : new Date(),
                    note: sanitizeText(req.body.note, 180),
                },
            },
        }, { new: true });
        if (!supplier) {
            return res.status(404).json({ message: "Fornecedor não encontrado." });
        }
        return res.json(supplier);
    }
    catch (error) {
        console.error("Erro ao inserir pagamento:", error);
        return res.status(500).json({ message: "Erro ao inserir pagamento." });
    }
}
async function removeSupplier(req, res) {
    try {
        const supplier = await Supplier_1.Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: "Fornecedor não encontrado." });
        }
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
        return res.status(500).json({ message: "Erro ao excluir fornecedor." });
    }
}
//# sourceMappingURL=supplierController.js.map