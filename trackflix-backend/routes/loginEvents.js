const express = require("express");
const router = express.Router();
const { connect } = require("../config/mongo"); // Your DB connection helper
const { verifyToken, requireAdmin } = require("../middleware/auth");

// POST /api/login-events - record login event
router.post("/", verifyToken, async (req, res) => {
  // Identity comes from the verified token, never from the request body.
  const { uid, email } = req.user;
  if (!uid || !email) {
    return res.status(400).json({ error: "Missing uid or email" });
  }

  try {
    const db = await connect();
    await db.collection("loginEvents").insertOne({
      uid,
      email,
      timestamp: new Date(),
    });
    res.json({ message: "Login event saved" });
  } catch (err) {
    console.error("Error saving login event:", err);
    res.status(500).json({ error: "Failed to save login event" });
  }
});

// GET /api/login-events/daily - get daily unique login counts
router.get("/daily", verifyToken, requireAdmin, async (req, res) => {
  try {
    const db = await connect();
    const pipeline = [
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          uniqueUsers: { $addToSet: "$uid" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          dailyLoginCount: { $size: "$uniqueUsers" },
        },
      },
      { $sort: { date: 1 } },
    ];
    const results = await db.collection("loginEvents").aggregate(pipeline).toArray();
    res.json(results);
  } catch (err) {
    console.error("Error fetching daily login stats:", err);
    res.status(500).json({ error: "Failed to fetch daily login stats" });
  }
});

// Optional: test route to check router works
router.get("/test", (req, res) => {
  res.json({ message: "Login Events router is working!" });
});

module.exports = router;
