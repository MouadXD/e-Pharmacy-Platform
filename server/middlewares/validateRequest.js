const validateRequest = (schema, property = "body") => {
  return (req, _, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return next(error);
    }

    if (property === "body") {
      req.body = value;
    }

    next();
  };
};

module.exports = validateRequest;
