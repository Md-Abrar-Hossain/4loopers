const Watchlist = require("../models/Watchlist");
const { movieSchema } = require("../middleware/validate");

/** Accepts the several field spellings the frontend has used over time. */
function normalizeMovie(movie = {}) {
  return {
    id: movie.id,
    title: movie.title || "Untitled",
    type: movie.type || "movie",
    image: movie.image || movie.img || movie.poster || "",
    rating: typeof movie.rating === "number" ? movie.rating : 0,
    genres: Array.isArray(movie.genres) ? movie.genres : [],
    releaseDate: movie.releaseDate,
    trailerLink: movie.trailerLink || movie.trailer || "",
    status: movie.status,
  };
}

// POST /api/watchlist/add
async function addMovie(req, res) {
  const { uid, email } = req.user;
  const { userId, userEmail, movie } = req.body;

  // The token decides who the user is; a mismatching body userId is an attack or a bug.
  if (userId && userId !== uid) {
    return res.status(403).json({ message: "You can only modify your own watchlist" });
  }

  const parsed = movieSchema.safeParse(normalizeMovie(movie));
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    });
  }
  const normalized = parsed.data;
  const ownerEmail = email || userEmail;
  if (!ownerEmail) return res.status(400).json({ message: "userEmail is required" });

  let watchlist = await Watchlist.findOne({ userId: uid });

  if (!watchlist) {
    watchlist = new Watchlist({ userId: uid, userEmail: ownerEmail, movies: [normalized] });
  } else {
    if (watchlist.movies.some((m) => m.id === normalized.id)) {
      return res.status(409).json({ message: "Movie already in watchlist" });
    }
    watchlist.movies.push(normalized);
    watchlist.userEmail = ownerEmail;
  }

  await watchlist.save();
  return res.status(201).json({ message: "Movie added to watchlist", watchlist });
}

// GET /api/watchlist/:userId?status=watched&sort=title|rating|added
async function getWatchlist(req, res) {
  const watchlist = await Watchlist.findOne({ userId: req.params.userId });
  if (!watchlist) return res.status(404).json({ message: "Watchlist not found" });

  const { status, sort } = req.query;
  if (!status && !sort) return res.json(watchlist);

  let movies = watchlist.toObject().movies;
  if (status) movies = movies.filter((m) => m.status === status);
  if (sort === "title") movies.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "rating") movies.sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
  if (sort === "added") movies.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  return res.json({ ...watchlist.toObject(), movies });
}

// PATCH /api/watchlist/:userId/:movieId   body: { status?, userRating? }
async function updateMovie(req, res) {
  const { userId, movieId } = req.params;
  const watchlist = await Watchlist.findOne({ userId });
  if (!watchlist) return res.status(404).json({ message: "Watchlist not found" });

  const movie = watchlist.movies.find((m) => m.id === String(movieId));
  if (!movie) return res.status(404).json({ message: "Movie not found in watchlist" });

  const { status, userRating } = req.body;
  if (status !== undefined) {
    movie.status = status;
    movie.watchedAt = status === "watched" ? new Date() : undefined;
  }
  if (userRating !== undefined) movie.userRating = userRating;

  watchlist.markModified("movies");
  await watchlist.save();
  return res.json({ message: "Movie updated", movie });
}

// DELETE /api/watchlist/:userId/:movieId
async function removeMovie(req, res) {
  const { userId, movieId } = req.params;
  const watchlist = await Watchlist.findOne({ userId });
  if (!watchlist) return res.status(404).json({ message: "Watchlist not found" });

  const before = watchlist.movies.length;
  watchlist.movies = watchlist.movies.filter((m) => m.id !== String(movieId));
  if (watchlist.movies.length === before) {
    return res.status(404).json({ message: "Movie not found in watchlist" });
  }
  await watchlist.save();
  return res.json({ message: "Movie removed from watchlist" });
}

// POST /api/ratings/:userId and /api/watchlist/ratings/:userId (kept for backwards compatibility)
async function setRating(req, res) {
  req.params.movieId = req.body.movieId;
  req.body = { userRating: req.body.userRating };
  return updateMovie(req, res);
}

// GET /api/watchlist/:userId/stats
async function getStats(req, res) {
  const watchlist = await Watchlist.findOne({ userId: req.params.userId });
  if (!watchlist) return res.status(404).json({ message: "Watchlist not found" });

  const movies = watchlist.movies;
  const byStatus = { plan_to_watch: 0, watching: 0, watched: 0 };
  const genreCounts = {};
  let ratingSum = 0;
  let ratingCount = 0;

  for (const m of movies) {
    byStatus[m.status || "plan_to_watch"] += 1;
    for (const g of m.genres || []) genreCounts[g] = (genreCounts[g] || 0) + 1;
    if (typeof m.userRating === "number" && m.userRating > 0) {
      ratingSum += m.userRating;
      ratingCount += 1;
    }
  }

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  return res.json({
    total: movies.length,
    byStatus,
    averageUserRating: ratingCount ? Number((ratingSum / ratingCount).toFixed(2)) : null,
    ratedCount: ratingCount,
    topGenres,
  });
}

module.exports = { addMovie, getWatchlist, updateMovie, removeMovie, setRating, getStats, normalizeMovie };
