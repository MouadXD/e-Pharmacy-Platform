const crypto = require("crypto");
const CustomError = require("./customError");

const isProduction = () => process.env.NODE_ENV === "production";

const getAllowedOrigins = () => {
  const configuredOrigins =
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const CSRF_SECRET_COOKIE = "csrf_secret";
const CSRF_TOKEN_HEADER = "x-csrf-token";
const authCookieNames = ["refresh_token", "connect.sid"];

const hasAuthCookie = (req) => {
  const cookieNames = req.headers?.cookie
    ? req.headers.cookie
        .split(";")
        .map((cookie) => cookie.trim().split("=")[0])
    : Object.keys(req.cookies || {});

  return cookieNames.some((name) => authCookieNames.includes(name));
};

const validateUnsafeRequestOrigin = (req, _res, next) => {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return next();
  }

  const origin = req.get("origin");

  // Browser requests carrying authentication cookies must identify their
  // origin. Requests without auth cookies can omit Origin for non-browser
  // clients; clients that use auth cookies can send an allowed Origin.
  if (!origin) {
    if (hasAuthCookie(req)) {
      return next(new CustomError("Origin header required", 403));
    }

    return next();
  }

  if (getAllowedOrigins().includes(origin)) {
    return next();
  }

  return next(new CustomError("Origin not allowed", 403));
};

const requireCsrfToken = (req, _res, next) => {
  const tokens = req.app.locals.csrfTokens;
  const secret = req.signedCookies?.[CSRF_SECRET_COOKIE];
  const token = req.get(CSRF_TOKEN_HEADER);

  let valid = false;

  if (tokens && secret && token) {
    try {
      valid = tokens.verify(secret, token);
    } catch {
      valid = false;
    }
  }

  if (!valid) {
    return next(new CustomError("Invalid CSRF token", 403));
  }

  next();
};

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
  getAllowedOrigins,
  validateUnsafeRequestOrigin,
  requireCsrfToken,
  CSRF_SECRET_COOKIE,
  CSRF_TOKEN_HEADER,
  refreshCookieOptions,
  clearCookieOptions,
  hashToken,
  escapeRegex,
  getPagination,
};
