//main container + logic
import { API_BASE_URL } from "../../config";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { addMovieToWatchlist } from "../../api/watchlist";

import FanFavouriteCard from "./FanFavourites/FanFavouriteCard";
import TrailerModal from "../common/TrailerModal";
import useAutoScroll from "./FanFavourites/useAutoScroll";
import axios from "axios";

const FanFavorites = ({ isLoggedIn, onRequireLogin }) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCard, setFlippedCard] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const [fanFavorites, setFanFavorites] = useState([]);

  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailerUrl, setCurrentTrailerUrl] = useState(null);

  const scrollByValue = 240;

  // Fetch fan favorites
  useEffect(() => {
  const fetchFanFavorites = async () => {
    try {
      
    const response = await axios.get(`${API_BASE_URL}/fanfavourites`);
      setFanFavorites(response.data);
    } catch (error) {
      console.error("Failed to fetch fan favorites:", error);
    }
  };

  fetchFanFavorites();
}, []);

  // Use custom hook for auto scroll
  useAutoScroll(sliderRef, scrollByValue, fanFavorites, setActiveIndex, autoRotate);

  const scrollLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: -scrollByValue, behavior: "smooth" });
    setAutoRotate(false);
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: scrollByValue, behavior: "smooth" });
    setAutoRotate(false);
  };

  const scrollToIndex = (index) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollTo({ left: scrollByValue * index, behavior: "smooth" });
    setActiveIndex(index);
    setAutoRotate(false);
  };

  // Open trailer modal
  const openTrailer = (url) => {
    if (!url) return;
    const embedUrl = url.replace("watch?v=", "embed/") + "?autoplay=1&controls=1&modestbranding=1";
    setCurrentTrailerUrl(embedUrl);
    setShowTrailer(true);
  };

  // Handle watchlist click
  const handleWatchlistClick = async (e, movie) => {
    e.stopPropagation();

    if (!user) {
      if (onRequireLogin) onRequireLogin();
      else alert("Please log in to add to your watchlist.");
      return;
    }

    if (!movie.id) {
      alert("Movie ID is missing. Cannot add to watchlist.");
      return;
    }

    const movieData = {
      id: movie.id.toString(),
      title: movie.title || "Untitled",
      type: movie.type || "movie",
      image: movie.image || movie.img || movie.poster || "",
      rating: typeof movie.rating === "number" ? movie.rating : 0,
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      releaseDate: movie.releaseDate ? movie.releaseDate.toString() : "",
      trailerLink: movie.trailerLink || movie.trailer || "",
    };

    try {
      const response = await addMovieToWatchlist(user.uid, user.email, movieData);

      if (response.success) {
        alert(response.data.message || `"${movie.title}" added to your watchlist!`);
        navigate("/dashboard");
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      alert("Failed to add to watchlist. Please try again.");
    }
  };

  return (
    <section
      className="relative bg-gradient-to-b from-zinc-900 to-black text-white py-6"
      aria-label="Fan Favorites"
    >
      {/* Heading */}
      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-center group"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-yellow-400 text-2xl">🎬</span>
        <span className="text-yellow-400">Fan Favorites</span>
        <span className="text-yellow-400 transition-transform duration-300 group-hover:translate-x-1">
          &gt;
        </span>
      </motion.h2>

      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-70 p-3 rounded-full shadow-lg hover:bg-opacity-90 hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
      >
        <FaChevronLeft className="text-yellow-400 w-5 h-5" />
      </button>

      <button
        onClick={scrollRight}
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-70 p-3 rounded-full shadow-lg hover:bg-opacity-90 hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
      >
        <FaChevronRight className="text-yellow-400 w-5 h-5" />
      </button>

      {/* Cards Container */}
      <div
        ref={sliderRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6"
        style={{ scrollBehavior: "smooth" }}
      >
        {fanFavorites.map((item, index) => (
          <FanFavouriteCard
            key={item.id}
            item={item}
            index={index}
            isFlipped={flippedCard === index}
            flippedCard={flippedCard}
            setFlippedCard={setFlippedCard}
            openTrailer={openTrailer}
            handleWatchlistClick={handleWatchlistClick}
          />
        ))}
      </div>

      {/* Get More Recommendations Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate("/movies")}
          className="inline-flex items-center gap-2 px-6 py-3 border border-yellow-500 text-yellow-400 font-semibold rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 group text-sm sm:text-base"
        >
          Get More Recommendations
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 gap-3">
        {fanFavorites.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-4 h-4 rounded-full focus:outline-none transition-colors duration-300 ${
              idx === activeIndex ? "bg-yellow-400" : "bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          url={currentTrailerUrl}
          onClose={() => setShowTrailer(false)}
        />
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default FanFavorites;
