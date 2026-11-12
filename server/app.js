require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const Tokens = require("csrf");

const app = express();
const csrfTokens = new Tokens();
app.locals.csrfTokens = csrfTokens;

const {
  isProduction,
  getAllowedOrigins,
  validateUnsafeRequestOrigin,
  CSRF_SECRET_COOKIE,
} = require("./utils/security");

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const CSRF_SECRET_TTL_MS = 2 * 60 * 60 * 1000;
const CustomError = require("./utils/customError");
const errorHandler = require("./middlewares/errorHandler.js");
const notFound = require("./routes/notFoundRoute.js");

// Enable this only when the API is behind a trusted reverse proxy. Trusting
// forwarded headers on a directly exposed server lets clients spoof their IP
// and bypass IP-based rate limits.
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY) || 1);
}
app.disable("x-powered-by");

app.use(helmet());
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  next();
});

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new CustomError("Origin not allowed by CORS", 403));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    optionsSuccessStatus: 204,
  }),
);

if (process.env.NODE_ENV === "development") {
  app.use(
    morgan("dev", {
      skip: (req) =>
        req.path.startsWith("/api/v1/auth/resetPassword") ||
        req.path.startsWith("/api/v1/auth/google"),
    }),
  );
}

// Stripe requires the raw body for signature verification, so this must be
// mounted before the global JSON parser.
const stripeWebhookRoute = require("./routes/stripeWebhookRoute.js");
app.use("/api/v1/stripe", stripeWebhookRoute);

app.use(express.json({ limit: "1mb", strict: true }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(require("./middlewares/sanitizeMongo"));

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not configured");
}

for (const secretName of ["ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"]) {
  if (!process.env[secretName]) {
    throw new Error(`${secretName} is not configured`);
  }
}

require("./helpers/passportConfig.js");

const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/online-pharmacy";
const sessionStore =
  process.env.NODE_ENV === "test"
    ? undefined
    : MongoStore.create({
        mongoUrl: mongoUri,
        ttl: SESSION_TTL_MS / 1000,
        autoRemove: "native",
        touchAfter: 24 * 3600,
        crypto: { secret: process.env.SESSION_SECRET },
      });

const sessionOptions = {
  name: "connect.sid",
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // `maxAge` is authoritative and refreshes the expiry whenever the
    // session Cookie is constructed. `expires` is declared before it so both
    // settings are explicit.
    expires: new Date(Date.now() + SESSION_TTL_MS),
    maxAge: SESSION_TTL_MS,
  },
};

// Preserve the existing environment-based behavior while making the secure
// setting explicit for static analysis: production is HTTPS-only.
sessionOptions.cookie.secure = true;

if (!isProduction()) {
  sessionOptions.cookie.secure = false;
}

// Optional: only set this when the session must be shared across subdomains.
// Leaving it unset keeps the cookie host-only, which is the safer default.
sessionOptions.cookie.domain = process.env.SESSION_COOKIE_DOMAIN;

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(process.env.SESSION_SECRET));

const connectDB = require("./config/connect.js");
connectDB().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      status: options.statusCode,
      message: "Too many requests, try again later",
    });
  },
});

app.use("/api/v1", apiLimiter);

// Protect every state-changing API route below from cross-origin requests.
// The Stripe webhook above is signature-verified and intentionally excluded.
app.use("/api/v1", validateUnsafeRequestOrigin);

const csrfCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: "lax",
  path: "/",
  maxAge: CSRF_SECRET_TTL_MS,
  signed: true,
});

// Issue a token for the cookie-authenticated refresh/logout routes. The
// secret is kept in a signed, host-only cookie; the token is returned in the
// response and must be echoed in the X-CSRF-Token header.
app.get("/api/v1/auth/csrf", (req, res) => {
  res.set("Cache-Control", "no-store");

  let secret = req.signedCookies?.[CSRF_SECRET_COOKIE];

  if (!secret) {
    secret = csrfTokens.secretSync();
  }

  // Reissue the signed secret so its expiry is extended whenever a token is
  // requested, while keeping the same secret for the token returned below.
  res.cookie(CSRF_SECRET_COOKIE, secret, csrfCookieOptions());

  res.json({ csrfToken: csrfTokens.create(secret) });
});

// Route modules
const authRoute = require("./routes/authRoute.js");
const refreshRoute = require("./routes/refreshRoute.js");
const productsRoute = require("./routes/productsRoute.js");
const categoriesRoute = require("./routes/categoriesRoute.js");
const manufactoriesRoute = require("./routes/manufactoriesRoute.js");
const couponsRoute = require("./routes/couponsRoute.js");
const suppliersRoute = require("./routes/suppliersRoute.js");
const usersRoute = require("./routes/usersRoute.js");
const statisticsRoute = require("./routes/statisticsRoute.js");
const discountsRoute = require("./routes/discountsRoute.js");
const adressesRoute = require("./routes/adressesRoute.js");
const ordersRoute = require("./routes/ordersRoutes.js");
const adsRoute = require("./routes/advertissemenRoute.js");
const postsRoute = require("./routes/postsRoutes.js");
const paypalRoutes = require("./routes/paypalRoutes.js");
const stripeRoutes = require("./routes/stripeRoutes.js");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/token", refreshRoute);

app.use("/api/v1", productsRoute);
app.use("/api/v1", categoriesRoute);
app.use("/api/v1", manufactoriesRoute);
app.use("/api/v1", couponsRoute);
app.use("/api/v1", discountsRoute);
app.use("/api/v1", suppliersRoute);
app.use("/api/v1", usersRoute);
app.use("/api/v1", adressesRoute);
app.use("/api/v1", ordersRoute);
app.use("/api/v1", adsRoute);
app.use("/api/v1", statisticsRoute);
app.use("/api/v1", postsRoute);
app.use("/api/v1", paypalRoutes);
app.use("/api/v1/stripe", stripeRoutes);

app.use("*", notFound);
app.use(errorHandler);

module.exports = app;
