const jwt = require("jsonwebtoken");

const getAccessSecret = () => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured");
  }
  return process.env.ACCESS_TOKEN_SECRET;
};

const generateAccessToken = (id, tokenVersion = 0) => {
  return jwt.sign(
    { id: String(id), tokenVersion, type: "access" },
    getAccessSecret(),
    {
      algorithm: "HS256",
      expiresIn: process.env.ACCESS_TOKEN_TTL || "15m",
      issuer: "online-pharmacy",
      audience: "online-pharmacy-client",
    },
  );
};

module.exports = generateAccessToken;
