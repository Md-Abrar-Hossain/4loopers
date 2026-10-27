const mongoose = require("mongoose");

const WATCH_STATUSES = ["plan_to_watch", "watching", "watched"];

const movieSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  rating: { type: Number },      // Movie general rating
  userRating: { type: Number },  // User personal rating
  status: { type: String, enum: WATCH_STATUSES, default: "plan_to_watch" },
  addedAt: { type: Date, default: Date.now },
  watchedAt: { type: Date },
  genres: { type: [String], default: [] },
  releaseDate: { type: String },
  trailerLink: { type: String },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^data:image\/[a-z]+;base64,/.test(v) ||
          /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|bmp)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid image URL or base64 string!`,
    },
  },
}, { _id: false });

const watchlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  movies: [movieSchema],
}, { timestamps: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);
module.exports.WATCH_STATUSES = WATCH_STATUSES;
