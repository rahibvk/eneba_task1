const express = require("express");
const cors = require("cors");
const path = require("path");
const healthRouter = require("./routes/health");
const listRouter = require("./routes/list");
const errorHandler = require("./middleware/errorHandler");

const app = express();
// Force production mode if on Render, or if NODE_ENV is "production"
const isProd = process.env.NODE_ENV === "production" || !!process.env.RENDER;

// CORS Configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!isProd || !origin) {
            // Allow same-origin, dev, or requests without Origin header
            callback(null, true);
        } else {
            const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(o => o.trim());
            const isRenderOrigin = origin.includes("onrender.com");

            if (allowedOrigins.includes(origin) || isRenderOrigin) {
                callback(null, true);
            } else {
                console.warn(`[CORS] Blocked origin: ${origin}`);
                callback(new Error("Not allowed by CORS"));
            }
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

// Namespaced API Routes
app.use("/api/health", healthRouter);
app.use("/api/list", listRouter);

// Backwards-compatible aliases
app.use("/health", healthRouter);
app.use("/list", listRouter);

// Static frontend hosting (production)
if (isProd) {
    const distPath = path.resolve(__dirname, "../../web/dist");

    app.use(express.static(distPath));

    // SPA fallback: any non-/api route returns index.html
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            const indexPath = path.join(distPath, "index.html");
            return res.sendFile(indexPath, (err) => {
                if (err && !res.headersSent) {
                    res.status(500).send("Could not serve index.html");
                }
            });
        }
        next();
    });
}

// Global 500 error handler
app.use(errorHandler);

module.exports = app;
