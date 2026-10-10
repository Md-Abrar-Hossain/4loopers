import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { addMovieToWatchlist } from "../../api/watchlist";

const FlipCard = ({ item, isFlipped, onFlip, isLoggedIn, onAddToWatchlist }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const auth = getAuth();

  // Convert YouTube watch URL to embed URL
  const embedUrl = item.trailerLink ? item.trailerLink.replace("watch?v=", "embed/") : null;
const handleWatchlistClick = useCallback(
    async (e) => {
    
      e.stopPropagation();
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated.");
        navigate("/login");
        return;
      }

      const movieData = {
        id: item.id.toString(),
        title: item.title,
        image: item.image || item.img || item.poster || "",
        rating: item.rating || 0,
        genres: item.genres || [],
        trailerLink: item.trailerLink || "",
        type: item.type || "movie",
        releaseDate: item.releaseDate || "",
      };

      try {
        const response = await addMovieToWatchlist(user.uid, user.email, movieData);

        if (!response.success) {
          alert(response.message);
        } else {
          alert(`"${item.title}" added to your watchlist!`);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Failed to add to watchlist:", error);
        alert("Failed to add to watchlist. Please try again.");
      }
      if (onAddToWatchlist) onAddToWatchlist(item);
    },
    [auth, isLoggedIn, item, navigate, onAddToWatchlist]
  );
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onFlip(item.id);
      }
    },
    [item.id, onFlip]
  );

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape" && showTrailer) {
        setShowTrailer(false);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showTrailer]);

  useEffect(() => {
    if (showTrailer) {
      modalRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showTrailer]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        onClick={() => onFlip(item.id)}
        onKeyDown={handleKeyDown}
        className="w-full h-[240px] sm:h-[260px] relative cursor-pointer perspective"
        style={{ perspective: "1000px" }}
        aria-label={`${item.title} card, press enter or space to flip`}
      >
        <div
          className="w-full h-full rounded-lg bg-zinc-900 shadow-md"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.6s ease",
            position: "relative",
          }}
        >
          {/* Front Side */}
          <div
            className="absolute w-full h-full rounded-lg overflow-hidden border border-zinc-700"
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover block"
              loading="lazy"
              onError={(e) => (e.target.src = "/fallback.jpg")}
            />
          </div>

          {/* Back Side */}
          <div
            className="absolute w-full h-full bg-zinc-900 text-white rounded-lg p-4 flex flex-col justify-between"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div>
              <h3 className="text-lg font-semibold mb-1 text-center" tabIndex={0}>
                {item.title}
              </h3>
              <p className="text-yellow-400 font-medium mb-1 text-center">⭐ {item.rating}</p>
              <p className="text-gray-400 text-sm text-center mb-3">{item.genres.join(", ")}</p>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              {embedUrl ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTrailer(true);
                  }}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  aria-label={`Watch trailer for ${item.title}`}
                >
                  <FaPlay className="inline mr-1" />
                  Trailer
                </button>
              ) : (
                <span className="text-gray-500 italic text-sm select-none">No trailer</span>
              )}

              <button
                onClick={handleWatchlistClick}
                className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                aria-label={`Add ${item.title} to watchlist`}
              >
                <FaPlus className="inline mr-1" />
                Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setShowTrailer(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trailer-title"
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            ref={modalRef}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-3 right-3 text-white bg-zinc-800 rounded-full p-2 hover:bg-red-600"
              aria-label="Close trailer"
            >
              ×
            </button>

            <iframe
              id="trailer-title"
              className="w-full h-full"
              src={`${embedUrl}?autoplay=1&controls=1&modestbranding=1`}
              title={`${item.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FlipCard;
