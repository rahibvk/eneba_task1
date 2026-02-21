/**
 * Global Express error middleware.
 * Must have 4 params to be recognized as an error handler.
 */
function errorHandler(err, _req, res, _next) {
    console.error(err.stack || err);
    res.status(500).json({ error: "Internal Server Error" });
}

module.exports = errorHandler;
