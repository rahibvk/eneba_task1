const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (_req, res, next) => {
    try {
        const health = {
            ok: true,
            nodeEnv: process.env.NODE_ENV,
            isProd: process.env.NODE_ENV === "production"
        };
        try {
            db.prepare("SELECT 1").get();
            health.db = "up";
        } catch {
            health.db = "down";
        }
        res.json(health);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
