"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./config/db");
const Product_1 = require("./model/Product");
dotenv_1.default.config();
const products = [
    {
        name: "Pizza da madrugada",
        slug: "pizza-da-madrugada",
        shortDescription: "Aquela pizza perfeita depois de um dia especial.",
        description: "Ajude os noivos com uma deliciosa pizza da madrugada para fechar a noite com chave de ouro.",
        price: 50,
        category: "Gastronomia",
        imageUrl: "",
        isFeatured: true,
        isActive: true,
        displayOrder: 1,
    },
    {
        name: "Café da manhã romântico",
        slug: "cafe-da-manha-romantico",
        shortDescription: "Um começo de dia cheio de carinho.",
        description: "Um presente simbólico para os noivos aproveitarem um café da manhã romântico juntos.",
        price: 80,
        category: "Momentos a Dois",
        imageUrl: "",
        isFeatured: true,
        isActive: true,
        displayOrder: 2,
    },
    {
        name: "Garrafa de vinho especial",
        slug: "garrafa-de-vinho-especial",
        shortDescription: "Um brinde inesquecível ao amor.",
        description: "Ajude os noivos a celebrarem com um vinho especial em um momento a dois.",
        price: 120,
        category: "Gastronomia",
        imageUrl: "",
        isFeatured: false,
        isActive: true,
        displayOrder: 3,
    },
    {
        name: "Jantar romântico",
        slug: "jantar-romantico",
        shortDescription: "Um jantar especial para celebrar o amor.",
        description: "Contribua para um jantar romântico e inesquecível dos noivos.",
        price: 200,
        category: "Momentos a Dois",
        imageUrl: "",
        isFeatured: true,
        isActive: true,
        displayOrder: 4,
    },
    {
        name: "Ajuda na lua de mel",
        slug: "ajuda-na-lua-de-mel",
        shortDescription: "Ajude a tornar a viagem ainda mais especial.",
        description: "Um presente simbólico para contribuir com momentos inesquecíveis na lua de mel.",
        price: 300,
        category: "Lua de Mel",
        imageUrl: "",
        isFeatured: true,
        isActive: true,
        displayOrder: 5,
    },
];
async function seed() {
    try {
        await (0, db_1.connectDatabase)();
        await Product_1.Product.deleteMany({});
        await Product_1.Product.insertMany(products);
        console.log("Produtos inseridos com sucesso.");
        await mongoose_1.default.connection.close();
    }
    catch (error) {
        console.error("Erro ao popular produtos:", error);
        await mongoose_1.default.connection.close();
    }
}
seed();
//# sourceMappingURL=seed.js.map