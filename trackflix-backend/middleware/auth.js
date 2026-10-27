const admin = require("../config/firebaseAdmin");

/**
 * Emails allowed to use admin endpoints, from the ADMIN_EMAILS env var
 * (comma separated). Fails closed: if the variable is empty, nobody is admin.
 */
function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Verifies the Firebase ID token in `Authorization: Bearer <token>`. */
async function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.user = { uid: decoded.uid, email: decoded.email || "" };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/** Must run after verifyToken. Only lets ADMIN_EMAILS through. */
function requireAdmin(req, res, next) {
  const email = (req.user?.email || "").toLowerCase();
  if (!email || !getAdminEmails().includes(email)) {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
}

/** Must run after verifyToken. Caller may only touch their own :userId. */
function requireOwner(req, res, next) {
  if (req.params.userId !== req.user.uid) {
    return res.status(403).json({ message: "You can only access your own data" });
  }
  return next();
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * For public content collections: reads stay public, any write
 * (POST/PUT/PATCH/DELETE) requires a verified admin.
 */
function protectWrites(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  return verifyToken(req, res, (err) => {
    if (err) return next(err);
    return requireAdmin(req, res, next);
  });
}

module.exports = { verifyToken, requireAdmin, requireOwner, protectWrites, getAdminEmails };
