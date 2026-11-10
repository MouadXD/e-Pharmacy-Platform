require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("../config/connect");
const User = require("../models/UsersModel");
const Category = require("../models/CategoriesModel");
const Product = require("../models/ProductsModel");

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

async function seed() {
  try {
    await connectDB();

    console.log("Starting database seeding...");

    const users = [
      {
        firstName: "Admin",
        lastName: "Test",
        email: process.env.SEED_ADMIN_EMAIL || "admin@test.local",
        password: process.env.SEED_ADMIN_PASSWORD,
        role: "admin",
        provider: "LOCAL",
      },
      {
        firstName: "Customer",
        lastName: "Test",
        email: process.env.SEED_CUSTOMER_EMAIL || "customer@test.local",
        password: process.env.SEED_CUSTOMER_PASSWORD,
        role: "user",
        provider: "LOCAL",
      },
    ];

    for (const user of users) {
      if (!user.password) {
        throw new Error(
          `Set SEED_ADMIN_PASSWORD and SEED_CUSTOMER_PASSWORD before running the seed script`,
        );
      }

      const exists = await User.findOne({ email: user.email });

      if (!exists) {
        const hashedPassword = await bcrypt.hash(user.password, BCRYPT_ROUNDS);

        await User.create({
          ...user,
          password: hashedPassword,
        });

        console.log(`Created user: ${user.email}`);
      }
    }

    const categories = [
      { title: "Medicines", description: "General medicines" },
      { title: "Skincare", description: "Skincare products" },
      { title: "Vitamins", description: "Vitamins and supplements" },
    ];

    for (const category of categories) {
      await Category.updateOne(
        { title: category.title },
        { $setOnInsert: category },
        { upsert: true },
      );
    }

    console.log("Categories ready.");

    const savedCategories = await Category.find();
    const categoryMap = Object.fromEntries(
      savedCategories.map((category) => [category.title, category._id]),
    );

    const products = [
      {
        title: "Paracetamol 500mg",
        description: {
          main: "Pain and fever relief.",
          benefits: ["Pain relief", "Fever reduction"],
          uses: ["Mild pain", "Fever"],
          safetyInformations: ["Follow the package instructions."],
        },
        price: 25,
        quantity: 100,
        prescripted: false,
        categoryId: categoryMap["Medicines"],
      },
      {
        title: "Ibuprofen 200mg",
        description: {
          main: "Anti-inflammatory pain relief.",
          benefits: ["Pain relief"],
          uses: ["Pain and inflammation"],
          safetyInformations: ["Follow the package instructions."],
        },
        price: 35,
        quantity: 80,
        prescripted: false,
        categoryId: categoryMap["Medicines"],
      },
      {
        title: "Moisturizing Cream",
        description: {
          main: "Daily moisturizing cream.",
          benefits: ["Skin hydration"],
          uses: ["Dry skin"],
          safetyInformations: ["For external use only."],
        },
        price: 60,
        quantity: 40,
        prescripted: false,
        categoryId: categoryMap["Skincare"],
      },
      {
        title: "Gentle Facial Cleanser",
        description: {
          main: "Gentle facial cleanser.",
          benefits: ["Cleanses skin"],
          uses: ["Daily skincare"],
          safetyInformations: ["Avoid contact with eyes."],
        },
        price: 75,
        quantity: 30,
        prescripted: false,
        categoryId: categoryMap["Skincare"],
      },
      {
        title: "Vitamin C 500mg",
        description: {
          main: "Vitamin C supplement.",
          benefits: ["Provides vitamin C"],
          uses: ["Dietary supplementation"],
          safetyInformations: ["Follow the package instructions."],
        },
        price: 45,
        quantity: 50,
        prescripted: false,
        categoryId: categoryMap["Vitamins"],
      },
    ];

    for (const product of products) {
      await Product.updateOne(
        { title: product.title },
        { $setOnInsert: product },
        { upsert: true },
      );
    }

    console.log("Products ready.");
    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();
