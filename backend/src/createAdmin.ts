import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "./config/db";
import { User } from "./model/User";

dotenv.config();

async function main() {
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");
  const name = String(process.env.ADMIN_NAME || "Administrador").trim();

  if (!email || !password) {
    throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD antes de executar.");
  }

  if (password.length < 8) {
    throw new Error("A senha do admin precisa ter pelo menos 8 caracteres.");
  }

  await connectDatabase();

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.findOneAndUpdate(
    { email },
    {
      email,
      name,
      passwordHash,
      role: "admin",
      provider: "local",
      avatarUrl: null,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log(`Admin pronto: ${user.email}`);
}

main()
  .catch((error) => {
    console.error("Erro ao criar admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
