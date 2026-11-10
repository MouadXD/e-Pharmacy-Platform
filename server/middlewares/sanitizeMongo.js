const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

const sanitizeMongoValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeMongoValue);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const sanitized = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    if (
      key.startsWith("$") ||
      key.includes(".") ||
      key === "__proto__" ||
      key === "constructor" ||
      key === "prototype"
    ) {
      continue;
    }

    sanitized[key] = sanitizeMongoValue(nestedValue);
  }

  return sanitized;
};

const sanitizeMongo = (req, res, next) => {
  for (const property of ["body", "params", "query"]) {
    if (req[property] !== undefined) {
      req[property] = sanitizeMongoValue(req[property]);
    }
  }

  next();
};

module.exports = sanitizeMongo;
