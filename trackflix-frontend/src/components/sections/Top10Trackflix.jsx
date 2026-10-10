import { API_BASE_URL } from "../../config";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

import Top10Card from "../Top10TrackflixExtra/Top10Card";
import TrailerModal from "../common/TrailerModal";

const Top10Trackflix = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const [top10, setTop10] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailerUrl, setCurrentTrailerUrl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState(0); // Pagination: 0 or 1 (for 5 items per page)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchTop10Movies = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/toptenmovies`
        );
        setTop10(data);
      } catch (err) {
        console.error("Failed to fetch top10:", err);
      }
    };

    fetchTop10Movies();
  }, []);

  const totalPages = Math.ceil(top10.length / 5);
  const visibleMovies = top10.slice(page * 5, page * 5 + 5);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth * 0.9;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const openTrailer = (url) => {
    if (!url) return;
    const embedUrl = url.replace("watch?v=", "embed/");
    setCurrentTrailerUrl(embedUrl + "?autoplay=1&controls=1&modestbranding=1");
    setShowTrailer(true);
  };

  const handleWatchlistClick = async (e, item) => {
    e.preventDefault();
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
      id: item.id,
      title: item.title,
      img: item.img,
      rating: item.rating,
      genres: item.genres || [],
      trailerLink: item.trailer || "",
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/watchlist/add`,
        {
          userId: user.uid,
          userEmail: user.email,
          movie: movieData,
        }
      );

      if (response.status === 201) {
        alert(response.data.message || `${item.title} added to your watchlist!`);
        navigate("/dashboard");
      } else {
        alert("Failed to add to watchlist. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert(`${item.title} is already in your watchlist!`);
      } else {
        console.error("Failed to add to watchlist:", error);
        alert("Failed to add to watchlist. Please try again.");
      }
    }
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  return (
    <section
  aria-labelledby="top10-title"
  className="bg-gradient-to-b from-zinc-900 to-black text-white px-1 py-3 sm:px-6 sm:py-14 overflow-x-hidden"
>


      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 sm:mb-10 px-2">
          <h2
            id="top10-title"
            className="text-xl sm:text-3xl font-extrabold text-yellow-400 whitespace-normal max-w-full mx-auto"
          >
            🎬 Top 10 on Trackflix This Week
          </h2>
          <p className="mt-1 text-gray-400 text-xs sm:text-base max-w-full sm:max-w-xl mx-auto">
            The hottest shows and movies everyone's watching
          </p>
        </header>

        {/* Mobile Scroll */}
        <div className="sm:hidden relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 py-2"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            {visibleMovies.map((item) => (
              <div
                key={item.id}
                className="flex-none w-[38vw] min-w-[160px] max-w-[220px] relative snap-start"
              >
                <Top10Card
                  item={item}
                  onTrailerOpen={openTrailer}
                  onWatchlistAdd={handleWatchlistClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop & Tablet: no wrapping, horizontal scroll */}
<div className="hidden sm:flex gap-3 justify-start overflow-x-auto scrollbar-hide">
  {visibleMovies.map((item) => (
    <div
      key={item.id}
      className="flex-shrink-0 min-w-[160px] max-w-[220px]"
      style={{ width: '20%' }}
    >
      <Top10Card
        item={item}
        onTrailerOpen={openTrailer}
        onWatchlistAdd={handleWatchlistClick}
      />
    </div>
  ))}
</div>


      
        {/* Pagination Buttons - only show on tablet and desktop */}
<div className="hidden sm:flex justify-center gap-4 mt-6">
  <button
    onClick={handlePrev}
    disabled={page === 0}
    className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold disabled:bg-yellow-300 disabled:cursor-not-allowed"
  >
    Previous
  </button>
  <button
    onClick={handleNext}
    disabled={page === totalPages - 1}
    className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold disabled:bg-yellow-300 disabled:cursor-not-allowed"
  >
    Next
  </button>
</div>

      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          url={currentTrailerUrl}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </section>
  );
};

export default Top10Trackflix;
