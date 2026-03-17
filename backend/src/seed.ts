import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "./config/db";
import { Product } from "./model/Product";

dotenv.config();

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
    await connectDatabase();

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log("Produtos inseridos com sucesso.");
    await mongoose.connection.close();
  } catch (error) {
    console.error("Erro ao popular produtos:", error);
    await mongoose.connection.close();
  }
}

seed();