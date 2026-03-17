"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
const Product_1 = require("../model/Product");
async function getProducts(_req, res) {
    try {
        const products = await Product_1.Product.find({ isActive: true }).sort({
            displayOrder: 1,
            createdAt: 1,
        });
        return res.json(products);
    }
    catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return res.status(500).json({ message: "Erro ao buscar produtos" });
    }
}
//# sourceMappingURL=productController.js.map