import { API_BASE_URL } from "../../config";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase-config";
import InterestCard from "../PopularInterestsExtra/InterestCard";
import TrailerModal from "../common/TrailerModal";
import { useFetchInterests } from "../PopularInterestsExtra/useFetchInterests";
import axios from "axios";

const ITEMS_PER_PAGE = 5;

const PopularInterests = () => {
  const [user] = useAuthState(auth);
  const [page, setPage] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailerUrl, setCurrentTrailerUrl] = useState(null);
  const navigate = useNavigate();
  const { interests } = useFetchInterests();

  const totalPages = Math.ceil(interests.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const currentItems = interests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleWatchlistClick = async (e, movie) => {
    e.stopPropagation();
    if (!user) return navigate("/login");

    const movieData = {
      id: movie.id?.toString() || null,
      title: movie.title || "Untitled",
      type: movie.type || "movie",
      image: movie.image || movie.img || movie.poster || "",
      rating: typeof movie.rating === "number" ? movie.rating : 0,
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      releaseDate: movie.releaseDate?.toString() || "",
      trailerLink: movie.trailerLink || movie.trailer || "",
    };

    try {
      const { status, data } = await axios.post(`${API_BASE_URL}/watchlist/add`, {
        userId: user.uid,
        userEmail: user.email,
        movie: movieData,
      });

      if (status === 201) {
        alert(data.message || `"${movie.title}" added!`);
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to add to watchlist.");
      }
    } catch {
      alert("Failed to add to watchlist.");
    }
  };

  const openTrailer = (url) => {
    if (!url) return;
    const embedUrl = url.replace("watch?v=", "embed/");
    setCurrentTrailerUrl(embedUrl + "?autoplay=1&controls=1");
    setShowTrailer(true);
  };

  useEffect(() => {
    const escHandler = (e) => e.key === "Escape" && setShowTrailer(false);
    window.addEventListener("keydown", escHandler);
    document.body.style.overflow = showTrailer ? "hidden" : "auto";
    return () => {
      window.removeEventListener("keydown", escHandler);
      document.body.style.overflow = "auto";
    };
  }, [showTrailer]);

  return (
    <section
  className="bg-gradient-to-b from-zinc-900 to-black text-white px-2 py-4 sm:px-3 sm:py-6 overflow-x-hidden"
>

      <h2 className="text-4xl text-center text-purple-500 mb-6">Upcoming...</h2>

     {/* Mobile */}
<div className="sm:hidden flex gap-3 overflow-x-auto px-4 py-2">
  {currentItems.map((item) => (
    <InterestCard
      key={item.id}
      item={item}
      onWatchTrailer={openTrailer}
      onAddToWatchlist={handleWatchlistClick}
      isMobile={true}
    />
  ))}
</div>


      {/* Desktop */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentItems.map((item) => (
          <InterestCard
            key={item.id}
            item={item}
            onWatchTrailer={openTrailer}
            onAddToWatchlist={handleWatchlistClick}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}>Previous</button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button onClick={() => setPage((p) => (p + 1) % totalPages)}>Next</button>
      </div>

      {/* Trailer Modal */}
      {showTrailer && <TrailerModal url={currentTrailerUrl} onClose={() => setShowTrailer(false)} />}
    </section>
  );
};

export default PopularInterests;
