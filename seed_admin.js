import bcrypt from "bcrypt";
import User from "./model/User.js";

export const seedAdmin = async () => {
  if (process.env.SEED_ADMIN !== "true") return null;

  const email = (process.env.ADMIN_EMAIL || "admin@wearthly.com")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD is required when SEED_ADMIN is true.");
  }

  let admin = await User.findOne({ email });
  const passwordHash = await bcrypt.hash(password, 10);

  if (admin) {
    admin.role = "admin";
    admin.isActive = true;
    admin.authProvider = "local";
    admin.password = passwordHash;
    await admin.save();
    console.log(`Admin account confirmed: ${email}`);
    return admin;
  }

  admin = await User.create({
    firstName: "Wearthly",
    lastName: "Admin",
    email,
    password: passwordHash,
    role: "admin",
    authProvider: "local",
    isActive: true,
  });

  console.log(`Admin account created: ${email}`);
  return admin;
};
