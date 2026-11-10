const CustomError = require("../utils/customError");
const asyncHandler = require("express-async-handler");

const checkRecaptchaToken = asyncHandler(async (req, res, next) => {
  const { recaptchaToken } = req.body;

  if (!process.env.CAPTCHA_KEY) {
    throw new CustomError("Recaptcha is not configured", 503);
  }

  if (!recaptchaToken || typeof recaptchaToken !== "string") {
    throw new CustomError("Recaptcha token required", 401);
  }

  const params = new URLSearchParams({
    secret: process.env.CAPTCHA_KEY,
    response: recaptchaToken,
  });

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: AbortSignal.timeout(5000),
    },
  );

  if (!response.ok) {
    throw new CustomError("Recaptcha verification failed", 503);
  }

  const { success } = await response.json();

  if (!success) {
    throw new CustomError("Invalid Recaptcha token", 401);
  }

  next();
});

module.exports = checkRecaptchaToken;
