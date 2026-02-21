/**
 * Seed the SQLite database with sample game offers.
 * Run: node src/seed.js
 */
require("dotenv").config();
const db = require("./db");

const baseGames = [
  { game_name: "Split Fiction", basePrice: 49.99, image_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1426210/library_600x900.jpg" }, // Using It Takes Two artwork closely mirroring the styled mock
  { game_name: "Red Dead Redemption 2", basePrice: 59.99, image_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg" },
  { game_name: "FIFA 23", basePrice: 69.99, image_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1811260/library_600x900.jpg" },
  { game_name: "Elden Ring", basePrice: 59.99, image_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg" },
  { game_name: "Cyberpunk 2077", basePrice: 59.99, image_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg" },
  { game_name: "Mario Kart 8 Deluxe", basePrice: 59.99, image_url: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1te8.png" }
];

const platforms = ["EA App", "Xbox Live", "Nintendo", "Steam"];
const regions = ["GLOBAL", "EUROPE"];

const OFFERS = [];

// Helper functions for pseudo-random but stable generation
const getDiscount = (str) => (str.length * 7) % 80;
const getLikes = (str) => (str.length * 43) % 2000;

baseGames.forEach(game => {
  platforms.forEach(platform => {
    regions.forEach(region => {
      const seedStr = game.game_name + platform + region;
      const discount_percent = getDiscount(seedStr);
      const price_original = game.basePrice;
      const price_current = price_original * (1 - discount_percent / 100);
      const has_cashback = discount_percent % 2 === 0 ? 1 : 0;
      const cashback_amount = has_cashback ? (price_current * 0.1).toFixed(2) : 0;

      let suffix = "Key";
      if (platform === "Nintendo") suffix = "Switch eShop Key";
      if (platform === "Xbox Live") suffix = "(Xbox Series X|S) XBOX LIVE Key";
      if (platform === "EA App") suffix = "EA App Key (PC)";
      if (platform === "Steam") suffix = "Steam Key";

      const title = `${game.game_name} ${suffix} ${region}`;

      OFFERS.push({
        game_name: game.game_name,
        title: title,
        platform: platform,
        region: region,
        currency: "EUR",
        price_current: parseFloat(price_current.toFixed(2)),
        price_original: price_original,
        discount_percent: discount_percent,
        has_cashback: has_cashback,
        cashback_amount: parseFloat(cashback_amount),
        likes_count: getLikes(seedStr),
        image_url: game.image_url
      });
    });
  });
});

// Clear and reseed
db.prepare("DELETE FROM offers").run();

const insert = db.prepare(`
  INSERT INTO offers (game_name, title, platform, region, currency,
    price_current, price_original, discount_percent,
    has_cashback, cashback_amount, likes_count, image_url)
  VALUES (@game_name, @title, @platform, @region, @currency,
    @price_current, @price_original, @discount_percent,
    @has_cashback, @cashback_amount, @likes_count, @image_url)
`);

const insertMany = db.transaction((offers) => {
  for (const offer of offers) insert.run(offer);
});

insertMany(OFFERS);

console.log(`Seeded ${OFFERS.length} offers into ${db.name}`);
