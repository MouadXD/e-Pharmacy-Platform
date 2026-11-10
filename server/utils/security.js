const crypto = require("crypto");

const isProduction = () => process.env.NODE_ENV === "production";

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: "lax",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});

const clearCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: "lax",
  path: "/",
});

const hashToken = (token) =>
  crypto.createHash("sha256").update(String(token)).digest("hex");

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getPagination = (query = {}, defaultLimit = 10, maxLimit = 100) => {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);

  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, maxLimit)
      : defaultLimit;

  return { page, limit, skip: (page - 1) * limit };
};

module.exports = {
  isProduction,
  refreshCookieOptions,
  clearCookieOptions,
  hashToken,
  escapeRegex,
  getPagination,
};
