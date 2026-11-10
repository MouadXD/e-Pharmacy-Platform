const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const UserModel = require("../models/UsersModel");

const testEmail = `test.${Date.now()}@example.com`;

describe("API smoke tests", () => {
  afterAll(async () => {
    await UserModel.deleteOne({ email: testEmail });
    await mongoose.connection.close();
  });

  test("rejects unauthenticated access to orders", async () => {
    const response = await request(app).get("/api/v1/orders");
    expect(response.statusCode).toBe(401);
  });

  test("returns 404 for an unknown route", async () => {
    const response = await request(app).get("/not-found-route");
    expect(response.statusCode).toBe(404);
  });

  test("returns the product list", async () => {
    const response = await request(app).get("/api/v1/products");
    expect(response.statusCode).toBe(200);
  });

  test("rejects invalid registration bodies", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@test.com" });
    expect(response.statusCode).toBe(400);
  });

  test("does not reveal invalid credentials", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@test.com", password: "aaAA@@11" });
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      success: false,
      status: 401,
      message: "Invalid username or password.",
    });
  });

  test("registers a valid account", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      firstName: "test",
      lastName: "test",
      email: testEmail,
      password: "aaAA@@11",
    });
    expect(response.statusCode).toBe(201);
  });

  test("has an active MongoDB connection", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
