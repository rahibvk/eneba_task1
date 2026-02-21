const express = require("express");
const cors = require("cors");
const path = require("path");
const healthRouter = require("./routes/health");
const listRouter = require("./routes/list");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const isProd = process.env.NODE_ENV === "production";

// CORS Configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!isProd) {
            // In dev, always allow the Vite dev server
            callback(null, "http://localhost:5173");
        } else {
            // In prod, check against CORS_ORIGIN env var (comma-separated)
            const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(o => o.trim());
            // origin is undefined for back-end to back-end requests
            // also allow same-origin frontend to access its own assets
            if (!origin || allowedOrigins.includes(origin) || origin.includes("localhost:4000")) {
                callback(null, origin);
            } else {
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
    const distPath = path.join(__dirname, "../../web/dist");
    app.use(express.static(distPath));

    // SPA fallback: any non-/api route returns index.html
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            return res.sendFile(path.join(distPath, "index.html"));
        }
        next();
    });
}

// Global 500 error handler
app.use(errorHandler);

module.exports = app;
