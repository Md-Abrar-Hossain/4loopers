const express = require("express");
const router = express.Router();
const admin = require("../config/firebaseAdmin");
const { verifyToken, requireAdmin } = require("../middleware/auth");

// GET /api/users - list Firebase users (admin only: exposes emails)
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  const listUsersResult = await admin.auth().listUsers(1000);
  const users = listUsersResult.users.map((user) => ({
    uid: user.uid,
    email: user.email,
    name: user.displayName || "",
  }));
  res.json(users);
});

module.exports = router;
