const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { protectWrites } = require("./middleware/auth");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Render/Vercel/etc. sit behind a proxy; needed for correct client IPs in rate limiting.
app.set("trust proxy", 1);

app.use(helmet());
if (process.env.NODE_ENV !== "test") app.use(morgan("tiny"));

// CORS: set CORS_ORIGINS="https://your-site.vercel.app,http://localhost:5173" in production.
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors(
    allowedOrigins.length
      ? { origin: allowedOrigins, credentials: true }
      : {} // no list configured: allow all origins (development only)
  )
);

// Watchlist images may be base64 data URIs, so allow a bit more than the 100kb default.
app.use(express.json({ limit: "1mb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
  })
);

// ---------- Routes ----------
app.use("/api/users", require("./routes/users"));
app.use("/api/login-events", require("./routes/loginEvents"));
app.use("/api/watchlist", require("./routes/watchlistRoutes"));
app.use("/api/ratings", require("./routes/ratingsRoutes"));

// Public content collections: anyone can read, only admins can write.
const content = {
  "/api/celebrities": "./routes/celebrityRoutes",
  "/api/fanfavourites": "./routes/fanFavouriteRoutes",
  "/api/featureditems": "./routes/featuredItemRoutes",
  "/api/ftrecommendations": "./routes/ftRecommendationRoutes",
  "/api/fullmovies": "./routes/fullMovieRoutes",
  "/api/fullmoviedetails": "./routes/fullMovieDetailRoutes",
  "/api/interests": "./routes/interestRoutes",
  "/api/liveshows": "./routes/liveShowRoutes",
  "/api/livetvshows": "./routes/liveTVShowRoutes",
  "/api/recommendationcelebrities": "./routes/recommendationCelebritiesRoutes",
  "/api/toptenmovies": "./routes/topTenMovieRoutes",
};
for (const [path, file] of Object.entries(content)) {
  app.use(path, protectWrites, require(file));
}

app.get("/", (req, res) => res.send("🎬 Trackflix Backend is running!"));
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
