const errorMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: 404,
    success: "failed",
    message: err,
  };

  if (err?.name === "ValidationError") {
    defaultError.statusCode = 400; // Validation errors usually return 400
    defaultError.message = Object.values(err.errors)
      .map((el) => el.message) // Handle `el` as a generic object
      .join(", ");
  }

  // Duplicate error (MongoDB 11000 error code)
  if (err.code === 11000) {
    defaultError.statusCode = 400; // Set to 400 for duplicate key errors
    defaultError.message = `${Object.values(err.keyValue).join(
      ", "
    )} field has to be unique!`;
  }

  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    message: defaultError.message,
  });
};

module.exports = errorMiddleware;
