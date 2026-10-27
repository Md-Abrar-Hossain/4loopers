const express = require("express");
const router = express.Router();

const { verifyToken, requireOwner } = require("../middleware/auth");
const { validateBody, addToWatchlistSchema, ratingSchema, updateMovieSchema } = require("../middleware/validate");
const c = require("../controllers/watchlistController");

// Every watchlist route needs a valid Firebase token.
router.use(verifyToken);

router.post("/add", validateBody(addToWatchlistSchema), c.addMovie);

// Legacy rating endpoint (same as POST /api/ratings/:userId)
router.post("/ratings/:userId", requireOwner, validateBody(ratingSchema), c.setRating);

router.get("/:userId/stats", requireOwner, c.getStats);
router.get("/:userId", requireOwner, c.getWatchlist);
router.patch("/:userId/:movieId", requireOwner, validateBody(updateMovieSchema), c.updateMovie);
router.delete("/:userId/:movieId", requireOwner, c.removeMovie);

module.exports = router;
