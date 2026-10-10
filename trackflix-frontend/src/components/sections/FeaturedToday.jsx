import { API_BASE_URL } from "../../config";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FlipCard from "../sectionExtra/FlipCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import axios from "axios";

const ITEM_WIDTH = 160;
const GAP = 12;

const FeaturedToday = () => {
  const [flippedCard, setFlippedCard] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/featureditems`
        );
        setFeaturedItems(response.data);
      } catch (e) {
        console.error("Failed to fetch featured items:", e);
      }
    }
    fetchItems();
  }, []);

  const handleFlip = useCallback(
    (id) => setFlippedCard((prev) => (prev === id ? null : id)),
    []
  );

  const handleAddToWatchlist = useCallback(
    async (movie) => {
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }
      try {
        await addDoc(collection(db, "watchlists"), {
          userEmail: auth.currentUser.email,
          movie,
        });
        alert("Added to watchlist!");
      } catch (error) {
        console.error(error);
      }
    },
    [auth.currentUser, navigate]
  );

  const scrollBy = useCallback(
    (offset) => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
      }
    },
    []
  );

  const scrollLeft = () => scrollBy(-(ITEM_WIDTH + GAP));
  const scrollRight = () => scrollBy(ITEM_WIDTH + GAP);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let startX = 0;
    let isDragging = false;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const onTouchEnd = (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (diff > 30) scrollRight();
      else if (diff < -30) scrollLeft();
      isDragging = false;
    };

    slider.addEventListener("touchstart", onTouchStart, { passive: true });
    slider.addEventListener("touchend", onTouchEnd);

    return () => {
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchend", onTouchEnd);
    };
  }, [scrollLeft, scrollRight]);

  return (
   
   <section
  aria-labelledby="Featured Today Section"
  className="bg-gradient-to-b from-zinc-900 to-black text-white px-1 py-3 sm:px-6 sm:py-14 overflow-x-hidden"
>


      <div className="max-w-7xl mx-auto w-full">
        <header className="mb-6 text-center">
         <h1 className="text-2xl sm:text-4xl font-bold text-yellow-400" tabIndex={0}>
   Featured Today
</h1>
          <p className="mt-1 text-gray-300 text-sm sm:text-base" tabIndex={0}>
            Blockbuster picks for you
          </p>
        </header>

        <div className="relative">
          {/* Left arrow - desktop only */}
          <button
            onClick={scrollLeft}
            aria-label="Scroll Left"
            className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-yellow-400 rounded-full p-2 z-10"
          >
            <FaChevronLeft size={18} />
          </button>

          {/* Scroll container */}
          <div
            ref={sliderRef}
            className="flex w-full gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 sm:px-6"
            style={{ scrollPaddingLeft: "12px", scrollPaddingRight: "12px" }}
            role="list"
          >
            {featuredItems.length === 0 && (
              <p className="text-yellow-400 mx-auto py-10">No featured items available.</p>
            )}
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="snap-center shrink-0 w-[45%] sm:w-[160px]"
                role="listitem"
              >
                <FlipCard
                  item={item}
                  isFlipped={flippedCard === item.id}
                  onFlip={handleFlip}
                  isLoggedIn={isLoggedIn}
                  onAddToWatchlist={handleAddToWatchlist}
                />
              </div>
            ))}
          </div>

          {/* Right arrow - desktop only */}
          <button
            onClick={scrollRight}
            aria-label="Scroll Right"
            className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-yellow-400 rounded-full p-2 z-10"
          >
            <FaChevronRight size={18} />
          </button>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/recommendations")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2"
          >
            Get More <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedToday;
