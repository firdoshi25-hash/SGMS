require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/User");

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in .env");
  }

  await connectDB();
  if (await User.exists({ email })) {
    throw new Error("That email already has an account; this command will not change its role or password");
  }

  await User.create({ name: "SGMS Administrator", email, password, role: "admin" });
  console.log("Administrator account created");
}

createAdmin()
  .catch((error) => {
    console.error(`Admin setup failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = require("mongoose");
    await mongoose.disconnect();
  });