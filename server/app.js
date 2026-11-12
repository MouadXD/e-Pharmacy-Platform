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

const app = express();

const { isProduction, getAllowedOrigins } = require("./utils/security");
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
    allowedHeaders: ["Content-Type", "Authorization"],
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
        ttl: 24 * 60 * 60,
        autoRemove: "native",
        touchAfter: 24 * 3600,
        crypto: { secret: process.env.SESSION_SECRET },
      });

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction(),
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

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
