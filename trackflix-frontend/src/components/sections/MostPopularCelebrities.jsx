import { API_BASE_URL } from "../../config";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const MostPopularCelebrities = () => {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

useEffect(() => {
  axios.get(`${API_BASE_URL}/Celebrities`)
    .then((response) => {
      setCelebrities(response.data);
      setLoading(false);
    })
    .catch((error) => {
      setError(error.message);
      setLoading(false);
    });
}, []);

  const scrollByOffset = useCallback((offset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-400 py-20">Loading celebrities...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 py-20">
        Error loading celebrities: {error}
      </p>
    );

  return (
    <section
  className="bg-gradient-to-b from-zinc-900 to-black text-white px-2 py-4 sm:px-3 sm:py-6 overflow-x-hidden"
>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-yellow-400">
            Most Popular Celebrities
          </h2>
          <p className="mt-2 text-gray-300 text-sm sm:text-base">
            Discover the stars everyone is talking about
          </p>
        </motion.div>

        {/* Carousel container */}
        <div className="relative">
          {/* Carousel Scrollable Area */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 px-2 sm:px-0"
            style={{ scrollbarWidth: "none" }}
          >
            {celebrities.map(({ id, img, name }) => (
              <motion.div
                key={id}
                className="snap-start flex-shrink-0 w-40 sm:w-44 md:w-48 cursor-pointer relative outline-none"
               // onClick={() => navigate(`/celebrity/${id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/celebrity/${id}`);
                  }
                }}
                aria-label={`View details for ${name}`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(255, 215, 0, 0.5)",
                }}
                whileFocus={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(255, 215, 0, 0.5)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative rounded-full overflow-hidden shadow-lg w-40 sm:w-44 md:w-48 h-40 sm:h-44 md:h-48 mx-auto bg-gray-800">
                  <img
                    src={img}
                    alt={name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                  />
                </div>
                <p className="mt-3 text-center font-semibold text-lg truncate">
                  {name}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => scrollByOffset(-240)}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full shadow-lg z-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-black" size={20} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scrollByOffset(240)}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full shadow-lg z-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-black" size={20} />
          </button>
        </div>

        {/* More Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/recommendations2")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-full font-medium flex items-center justify-center gap-2 mx-auto transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Get More Recommendations <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MostPopularCelebrities;
