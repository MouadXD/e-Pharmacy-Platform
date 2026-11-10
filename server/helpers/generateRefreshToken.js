const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const getRefreshSecret = () => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not configured");
  }
  return process.env.REFRESH_TOKEN_SECRET;
};

const generateRefreshToken = (id, tokenVersion = 0) => {
  return jwt.sign(
    { id: String(id), tokenVersion, type: "refresh", jti: crypto.randomUUID() },
    getRefreshSecret(),
    {
      algorithm: "HS256",
      expiresIn: process.env.REFRESH_TOKEN_TTL || "30d",
      issuer: "online-pharmacy",
      audience: "online-pharmacy-client",
    },
  );
};

module.exports = generateRefreshToken;
