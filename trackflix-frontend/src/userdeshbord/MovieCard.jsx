import React, { useState, useMemo, useEffect } from "react";

const STATUS_OPTIONS = [
  { value: "plan_to_watch", label: "Plan to watch" },
  { value: "watching", label: "Watching" },
  { value: "watched", label: "Watched" },
];

const MovieCard = ({ movie, onRate, editable = false, onStatusChange, onRemove }) => {
  const movieId = movie.id || movie.movieId;

  const imageSrc = useMemo(() => {
    return movie.image || movie.img || movie.poster || "/fallback.jpg";
  }, [movie]);

  const isValidImage = useMemo(() => {
    return (
      typeof imageSrc === "string" &&
      (imageSrc.startsWith("http") || imageSrc.startsWith("data:image"))
    );
  }, [imageSrc]);

  const [userRating, setUserRating] = useState(movie.userRating || 0);

  useEffect(() => {
    setUserRating(movie.userRating || 0);
  }, [movie.userRating]);

  const handleRatingChange = (e) => {
    const newRating = Number(e.target.value);
    setUserRating(newRating);
    if (onRate) onRate(movieId, newRating);
  };

  const ratingOptions = useMemo(() => [0, ...Array.from({ length: 10 }, (_, i) => i + 1)], []);

  return (
    <article
      tabIndex={0}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group w-full max-w-[90px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[200px] mx-auto"
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <img
          src={isValidImage ? imageSrc : "/fallback.jpg"}
          alt={movie.title || "Movie poster"}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            if (e.target.src !== "/fallback.jpg") {
              e.target.src = "/fallback.jpg";
            }
          }}
        />
        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[11px] px-2 py-[2px] rounded-full font-semibold shadow">
          ⭐ {(editable ? userRating : movie.rating || 0).toFixed(1)}
        </div>
      </div>

      <div className="p-3 bg-gradient-to-t from-white via-white/80 to-transparent">
        <h2 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-1">
          {movie.title || "Untitled"}
        </h2>
        <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2 mt-1">
          {Array.isArray(movie.genres) && movie.genres.length > 0
            ? movie.genres.join(", ")
            : "Genre N/A"}
        </p>

        {onStatusChange && (
          <div className="mt-2 flex items-center gap-1">
            <label htmlFor={`status-${movieId}`} className="sr-only">
              Watch status for {movie.title}
            </label>
            <select
              id={`status-${movieId}`}
              value={movie.status || "plan_to_watch"}
              onChange={(e) => onStatusChange(movieId, e.target.value)}
              className="flex-1 min-w-0 text-[10px] sm:text-xs rounded-md border border-gray-300 p-1 focus:ring-2 focus:ring-blue-400"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(movieId, movie.title)}
                aria-label={`Remove ${movie.title} from watchlist`}
                title="Remove"
                className="text-xs px-1.5 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {editable && (
          <div className="mt-3">
            <label htmlFor={`rating-${movieId}`} className="sr-only">
              Rate {movie.title}
            </label>
            <select
              id={`rating-${movieId}`}
              value={userRating}
              onChange={handleRatingChange}
              className="w-full text-xs rounded-md border border-gray-300 p-1 focus:ring-2 focus:ring-blue-400"
            >
              {ratingOptions.map((value) => (
                <option key={value} value={value}>
                  {value === 0 ? "None" : value}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </article>
  );
};

MovieCard.defaultProps = {
  movie: {
    title: "Untitled",
    rating: 0,
    userRating: 0,
    genres: [],
    image: "/fallback.jpg",
  },
  editable: false,
};

export default MovieCard;
