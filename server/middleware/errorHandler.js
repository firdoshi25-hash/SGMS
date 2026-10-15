function errorHandler(error, _req, res, _next) {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must contain valid JSON" });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body exceeds the 1 MB limit" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with those details already exists" });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const message = status < 500 ? error.message : "Internal server error";
  res.status(status).json({ message });
}

module.exports = errorHandler;