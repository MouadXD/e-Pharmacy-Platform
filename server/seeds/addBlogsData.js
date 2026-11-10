require("dotenv").config();

const connectDB = require("../config/connect");
const mongoose = require("mongoose");
const PostsModel = require("../models/PostsMode");
const UserModel = require("../models/UsersModel");
const { faker } = require("@faker-js/faker");

async function run() {
  try {
    await connectDB();

    const admin = await UserModel.findOne({ role: "admin" }).select("_id");

    if (!admin) {
      throw new Error("An admin user is required before blog fixtures are added");
    }

    for (let i = 0; i < 10; i += 1) {
      await PostsModel.create({
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(5, "\n\n"),
        image: {
          publicId: null,
          url: faker.image.url(),
        },
        adminId: admin._id,
      });
    }
  } catch (error) {
    console.error("Blog fixture creation failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
