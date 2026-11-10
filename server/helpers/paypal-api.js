require("dotenv").config();

const base = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  return {
    jsonResponse: body,
    httpStatusCode: response.status,
  };
}

const generateAccessToken = async () => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("MISSING_API_CREDENTIALS");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error("PAYPAL_AUTH_FAILED");
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("PAYPAL_AUTH_FAILED");
  }

  return data.access_token;
};

/**
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (amount, shipping) => {
  if (!amount || typeof amount.value !== "string") {
    throw new Error("INVALID_AMOUNT");
  }

  const accessToken = await generateAccessToken();

  const response = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount, shipping }],
    }),
    signal: AbortSignal.timeout(10000),
  });

  return handleResponse(response);
};

/**
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID) => {
  if (!/^[A-Za-z0-9-]{1,50}$/.test(String(orderID))) {
    throw new Error("INVALID_ORDER_ID");
  }

  const accessToken = await generateAccessToken();

  const response = await fetch(
    `${base}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    },
  );

  return handleResponse(response);
};

module.exports = { createOrder, captureOrder };
