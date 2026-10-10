import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const MostPCMoreRecommendations = () => {
  const [celebrities, setCelebrities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchCelebrities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/recommendationcelebrities`);
      setCelebrities(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch celebrities:", err.message);
    }
  };

  fetchCelebrities();
}, []);

  return (
    <section className="bg-gradient-to-b from-zinc-900 to-black text-white px-4 sm:px-6 py-10 min-h-screen">
    {/* Header with back button */}
      
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
      <div className="flex items-center mb-8 space-x-4 mt-16">
  <button
    onClick={() => navigate(-1)} // Go back
    className="text-yellow-400 hover:text-yellow-600 text-xl p-2"
    aria-label="Go Back"
  >
    <FaArrowLeft />
  </button>
  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-3xl md:text-4xl font-extrabold tracking-tight text-yellow-400"
  >
    More Celebrity Recommendations 
  </motion.h2>
</div>


        {/* Grid of all celebrities */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {celebrities.map((celeb) => (
            <motion.div
              key={celeb.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer relative"
            >
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg mx-auto bg-gray-800">
                <img
                  src={celeb.img}
                  alt={celeb.name}
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="mt-3 text-center font-semibold text-sm text-white">
                {celeb.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostPCMoreRecommendations;
