export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || 500;
  const payload = {
    message: statusCode === 500 ? "Internal server error" : err.message,
  };

  if (err.errors) payload.errors = err.errors;
  if (process.env.NODE_ENV !== "production" && statusCode === 500) payload.stack = err.stack;

  return res.status(statusCode).json(payload);
}
