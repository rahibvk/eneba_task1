const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (_req, res, next) => {
    try {
        const health = { ok: true };
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
