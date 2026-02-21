const express = require("express");
const db = require("../db");
const { parseListParams } = require("../validate");

const router = express.Router();

const OFFER_COLUMNS = `
  id, game_name, title, platform, region, currency,
  price_current, price_original, discount_percent,
  has_cashback, cashback_amount, likes_count, image_url
`;

const SIMILARITY_THRESHOLD = 0.4;

router.get("/", (req, res, next) => {
    try {
        const { limit, offset, search } = parseListParams(req.query);

        let count;
        let items;

        if (!search) {
            // No search — return newest first
            count = db.prepare("SELECT COUNT(*) AS count FROM offers").get().count;
            items = db.prepare(
                `SELECT ${OFFER_COLUMNS} FROM offers ORDER BY id DESC LIMIT ? OFFSET ?`
            ).all(limit, offset);
        } else {
            // Fuzzy search via custom similarity function
            count = db.prepare(`
        SELECT COUNT(*) AS count FROM offers
        WHERE MAX(similarity(title, ?), similarity(game_name, ?)) >= ?
      `).get(search, search, SIMILARITY_THRESHOLD).count;

            items = db.prepare(`
        SELECT ${OFFER_COLUMNS},
               MAX(similarity(title, ?), similarity(game_name, ?)) AS rank
        FROM offers
        WHERE rank >= ?
        ORDER BY rank DESC, id DESC
        LIMIT ? OFFSET ?
      `).all(search, search, SIMILARITY_THRESHOLD, limit, offset);

            // Strip internal rank column
            items = items.map(({ rank, ...offer }) => offer);
        }

        res.json({ count, items });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
