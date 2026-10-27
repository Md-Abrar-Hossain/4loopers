function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ message: err.message });
  }
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 ? "Internal server error" : err.message,
  });
}

module.exports = { notFound, errorHandler };
