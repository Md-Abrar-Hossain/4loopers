const { z } = require("zod");

/** Express middleware factory: validates req.body against a zod schema. */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }
    req.body = result.data;
    return next();
  };
}

const WATCH_STATUSES = ["plan_to_watch", "watching", "watched"];

const movieSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  title: z.string().trim().min(1).max(300).default("Untitled"),
  type: z.string().trim().min(1).max(50).default("movie"),
  image: z.string().min(1),
  rating: z.number().min(0).optional().default(0),
  genres: z.array(z.string().max(60)).max(20).optional().default([]),
  releaseDate: z.union([z.string(), z.number()]).optional().transform((v) => (v == null ? "" : String(v))),
  trailerLink: z.string().max(500).optional().default(""),
  status: z.enum(WATCH_STATUSES).optional().default("plan_to_watch"),
});

const addToWatchlistSchema = z.object({
  userId: z.string().optional(),
  userEmail: z.string().email().optional(),
  movie: z.object({}).passthrough(),
});

const ratingSchema = z.object({
  movieId: z.union([z.string(), z.number()]).transform(String),
  userRating: z.number().min(0).max(10),
});

const updateMovieSchema = z
  .object({
    status: z.enum(WATCH_STATUSES).optional(),
    userRating: z.number().min(0).max(10).optional(),
  })
  .refine((v) => v.status !== undefined || v.userRating !== undefined, {
    message: "Provide status and/or userRating",
  });

module.exports = {
  validateBody,
  movieSchema,
  addToWatchlistSchema,
  ratingSchema,
  updateMovieSchema,
  WATCH_STATUSES,
};
