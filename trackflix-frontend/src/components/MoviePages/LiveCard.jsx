import { API_BASE_URL } from "../../config";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaPlay, FaPlus } from "react-icons/fa";
import { auth } from "../../firebase/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";

const LiveCard = ({ movie }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const getEmbedUrl = (url) => {
    try {
      const videoId = new URL(url).searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    } catch {
      return "";
    }
  };

  const embedUrl = getEmbedUrl(movie.trailer || movie.trailerLink);
  const posterSrc = movie.image || movie.img || movie.poster || "/fallback.jpg";

  const handleAddToWatchlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const movieData = {
      id: movie.id?.toString() || null,
      title: movie.title || "Untitled",
      type: movie.type || "movie",
      image: posterSrc,
      rating: typeof movie.rating === "number" ? movie.rating : 0,
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      releaseDate: movie.releaseDate?.toString() || "",
      trailerLink: movie.trailerLink || movie.trailer || "",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/watchlist/add`, {
        userId: user.uid,
        userEmail: user.email,
        movie: movieData,
      });

      if (response.status === 201) {
        setFeedback(response.data.message || `"${movie.title}" added to watchlist`);
        setTimeout(() => setFeedback(null), 3000);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setFeedback(`"${movie.title}" is already in your watchlist!`);
      } else {
        console.error("Failed to add to watchlist:", error);
        setFeedback("Failed to add to watchlist. Please try again.");
      }
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <>
      <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-[1.03] group">
        {/* Image */}
        <div className="relative w-full h-[350px] bg-zinc-800 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent animate-spin rounded-full" />
            </div>
          )}
          <img
            src={posterSrc}
            alt={`${movie.title} poster`}
            title={movie.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = "/fallback.jpg";
              setImageLoaded(true);
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } group-hover:scale-105`}
          />
        </div>

        {/* Info */}
        <div className="p-3 md:p-4 space-y-3">
          <Link
            to={`/TvshowDetails/${movie.id}`}
            className="text-lg font-semibold text-white truncate block hover:underline"
          >
            {movie.title || "Untitled"}
          </Link>

          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <FaStar className="text-base" />
            <span className="font-medium">{movie.rating || "N/A"}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.genres?.slice(0, 3).map((genre, idx) => (
              <span
                key={idx}
                className="text-xs bg-zinc-700 px-3 py-1 rounded-full text-white"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="text-sm text-zinc-400">
            Release:{" "}
            <span className="text-white">{movie.releaseDate || "Unknown"}</span>
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-4">
            {embedUrl ? (
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 text-blue-400 hover:underline text-sm"
              >
                <FaPlay className="text-sm" />
                Trailer
              </button>
            ) : (
              <span className="text-gray-500 text-sm">No trailer</span>
            )}

            <button
              onClick={handleAddToWatchlist}
              className="flex items-center gap-2 text-red-400 hover:underline text-sm"
            >
              <FaPlus className="text-sm" />
              Watchlist
            </button>
          </div>

          {/* Feedback */}
          {feedback && <p className="text-green-400 text-sm mt-2">{feedback}</p>}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          onClick={() => setShowTrailer(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[90%] md:w-[700px] bg-zinc-900 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="flex justify-end p-2">
              <button
                onClick={() => setShowTrailer(false)}
                className="text-white hover:text-red-400 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="w-full aspect-video">
              <iframe
                loading="lazy"
                className="w-full h-full"
                src={embedUrl}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveCard;
