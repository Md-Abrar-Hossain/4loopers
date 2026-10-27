const express = require("express");
const router = express.Router();

const { verifyToken, requireOwner } = require("../middleware/auth");
const { validateBody, ratingSchema } = require("../middleware/validate");
const { setRating } = require("../controllers/watchlistController");

// POST /api/ratings/:userId   Body: { movieId, userRating (0-10) }
router.post("/:userId", verifyToken, requireOwner, validateBody(ratingSchema), setRating);

module.exports = router;
