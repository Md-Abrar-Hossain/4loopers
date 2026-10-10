import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from "react";
import FlipCard from "../components/sectionExtra/FlipCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const FTMoreRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [flippedCard, setFlippedCard] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch recommendations using axios
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/ftrecommendations`);
        setRecommendations(res.data);
      } catch (err) {
        setError("Failed to load recommendations");
        console.error("Error fetching FT recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleFlip = (id) => {
    setFlippedCard((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-black text-white min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 pt-16 text-center max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-500 drop-shadow-lg">
            🎬 More Movie Featured Today
          </h2>
          <p className="mt-3 text-gray-300 text-lg md:text-xl tracking-wide max-w-xl mx-auto leading-relaxed">
            Discover curated blockbuster favorites and hidden gems selected just for you.
          </p>
          <div className="mt-6 h-1 w-24 bg-yellow-500 rounded mx-auto shadow-md"></div>
        </header>

        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <FlipCard
                key={item.id}
                item={item}
                isFlipped={flippedCard === item.id}
                onFlip={handleFlip}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FTMoreRecommendations;
