import { API_BASE_URL } from "../config";
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaStar,
  FaFilm,
  FaCalendarAlt,
  FaClock,
  FaLanguage,
  FaGlobeAmericas,
  FaMoneyBillWave,
  FaUserTie,
  FaPenFancy,
  FaUsers,
  FaBuilding,
  FaAward,
  FaArrowLeft,
  FaRedoAlt,
} from "react-icons/fa";

import axios from "axios";

// Import animation variants from separate file
import { containerVariants, itemVariants } from "../animations/MDanimation";



// ... other imports remain the same


const MOBILE_BREAKPOINT = 768; // px

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  // Handle window resize to update isMobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fetching logic remains same
  const isValidId = /^\d+$/.test(id);
  const fetchMovie = async () => {
    setLoading(true);
    setError(null);
    setMovie(null);

    if (!isValidId) {
      setError("Invalid movie ID");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/fullmoviedetails/${id}`);
      setMovie(data);
    } catch (error) {
      if (error.response?.status === 404) setError("Movie not found");
      else setError("Failed to fetch movie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  // fetch similar movies same as before
  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (!movie?.similarMovies?.length) {
        setSimilar([]);
        return;
      }
      try {
        const responses = await Promise.all(
          movie.similarMovies.map(async (simId) => {
            try {
              const res = await axios.get(`${API_BASE_URL}/fullmoviedetails/${simId}`);
              return res.data;
            } catch {
              return null;
            }
          })
        );
        setSimilar(responses.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch similar movies", err);
        setSimilar([]);
      }
    };

    fetchSimilarMovies();
  }, [movie]);

  const youtubeId = useMemo(() => {
    if (!movie?.trailer) return null;
    try {
      const url = new URL(movie.trailer);
      return url.searchParams.get("v");
    } catch {
      return null;
    }
  }, [movie?.trailer]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback message={error} onRetry={fetchMovie} />;
  if (!movie) return <p className="text-center text-gray-400 mt-20 text-lg">No movie data available.</p>;

  // Mobile layout 
  const MobileLayout = () => (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen p-4 text-gray-100 font-sans max-w-7xl mx-auto overflow-x-hidden">
      <Link
        to="/movies"
        className="inline-flex items-center gap-2 mb-8 mt-12 text-yellow-400 hover:text-yellow-300 font-semibold text-lg"
      >
        <FaArrowLeft /> Back to movies
      </Link>

      <motion.div
        className="flex flex-col gap-6 max-w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.img
          src={movie.image}
          alt={`Poster of ${movie.title}`}
          className="mx-auto w-[160px] h-auto rounded-2xl shadow-2xl object-cover ring-1 ring-yellow-400"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(251, 191, 36, 0.8)",
          }}
          transition={{ type: "spring", stiffness: 250 }}
          loading="lazy"
        />

        <motion.div
          className="flex flex-col justify-between"
          variants={itemVariants}
        >
          <article>
            <motion.h1
              id="movie-title"
              className="text-3xl font-extrabold mb-4 tracking-tight text-yellow-400 drop-shadow-lg cursor-pointer"
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 15px rgba(255,255,0,0.9)",
              }}
            >
              {movie.title}
            </motion.h1>

            <p className="text-base text-gray-300 italic mb-6 leading-relaxed select-text break-words max-w-full">
              {movie.overview}
            </p>

            <motion.div
              className="grid grid-cols-1 gap-4 text-gray-400"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                    ease: "easeOut",
                    duration: 0.5,
                  },
                },
              }}
            >
              <InfoItem icon={<FaStar />} label="Rating" value={movie.rating || "N/A"} />
              <InfoItem icon={<FaFilm />} label="Genres" value={movie.genres?.join(", ")} />
              <InfoItem icon={<FaCalendarAlt />} label="Release Date" value={movie.releaseDate} />
              <InfoItem icon={<FaClock />} label="Runtime" value={`${movie.runtime} min`} />
              <InfoItem icon={<FaLanguage />} label="Language" value={movie.language} />
              <InfoItem icon={<FaGlobeAmericas />} label="Country" value={movie.country} />
              <InfoItem
                icon={<FaMoneyBillWave />}
                label="Budget"
                value={movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
              />
              <InfoItem
                icon={<FaMoneyBillWave />}
                label="Box Office"
                value={movie.boxOffice ? `$${movie.boxOffice.toLocaleString()}` : "N/A"}
              />
              <InfoItem icon={<FaUserTie />} label="Director" value={movie.director} />
              <InfoItem icon={<FaPenFancy />} label="Writers" value={movie.writers?.join(", ")} />
              <InfoItem icon={<FaUsers />} label="Cast" value={movie.cast?.join(", ")} />
              <InfoItem
                icon={<FaBuilding />}
                label="Production"
                value={movie.productionCompanies?.join(", ")}
              />
              <InfoItem icon={<FaStar />} label="Age Rating" value={movie.ageRating || "N/A"} />
            </motion.div>
          </article>

          {movie.awards?.length > 0 && (
            <motion.section className="mt-10" variants={itemVariants}>
              <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-3 drop-shadow-md">
                <FaAward /> Awards
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-400 text-base select-text">
                {movie.awards.map((award, i) => (
                  <li key={i}>
                    <span className="font-semibold text-gray-100">{award.name}</span> ({award.year}) —{" "}
                    {award.category} ({award.result})
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </motion.div>
      </motion.div>

      {/* Trailer and Similar sections could be same or slightly adapted */}
      {youtubeId && (
        <motion.section
          className="mt-14 max-w-full mx-auto rounded-2xl overflow-hidden shadow-2xl border border-yellow-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2 className="text-2xl font-extrabold mb-6 text-center text-yellow-400 drop-shadow-lg">
            🎥 Trailer
          </h2>
          <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
              frameBorder={0}
            />
          </div>
        </motion.section>
      )}

      {similar.length > 0 && (
        <motion.section
          className="mt-14"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">🎬 Similar Movies</h2>
          <div className="grid grid-cols-2 gap-4">
            {similar.map((m) => (
              <Link
                to={`/movies/${m.id}`}
                key={m.id}
                className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-all shadow-md group"
              >
                <img
                  src={m.image}
                  alt={m.title}
                  className="w-full h-32 object-cover rounded-md mb-2 transition-transform duration-200 group-hover:scale-105"
                />
                <h3
                  className="text-base font-semibold text-yellow-300 group-hover:underline truncate"
                  title={m.title}
                >
                  {m.title}
                </h3>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </section>
  );

  // Desktop layout 
  const DesktopLayout = () => (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen p-12 text-gray-100 font-sans max-w-7xl mx-auto overflow-x-hidden">
      <Link
        to="/movies"
        className="inline-flex items-center gap-2 mb-10 mt-12 text-yellow-400 hover:text-yellow-300 font-semibold text-lg"
      >
        <FaArrowLeft /> Back to movies
      </Link>

      <motion.div
        className="flex flex-row gap-12 max-w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.img
          src={movie.image}
          alt={`Poster of ${movie.title}`}
          className="w-full max-w-sm rounded-2xl shadow-2xl object-cover ring-1 ring-yellow-400"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(251, 191, 36, 0.8)",
          }}
          transition={{ type: "spring", stiffness: 250 }}
          loading="lazy"
        />

        <motion.div
          className="flex-1 flex flex-col justify-between max-w-full"
          variants={itemVariants}
        >
          <article>
            <motion.h1
              id="movie-title"
              className="text-5xl font-extrabold mb-6 tracking-tight text-yellow-400 drop-shadow-lg cursor-pointer"
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 15px rgba(255,255,0,0.9)",
              }}
            >
              {movie.title}
            </motion.h1>

            <p className="text-lg text-gray-300 italic mb-8 leading-relaxed select-text">
              {movie.overview}
            </p>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-400"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.2,
                    ease: "easeOut",
                    duration: 0.6,
                  },
                },
              }}
            >
              <InfoItem icon={<FaStar />} label="Rating" value={movie.rating || "N/A"} />
              <InfoItem icon={<FaFilm />} label="Genres" value={movie.genres?.join(", ")} />
              <InfoItem icon={<FaCalendarAlt />} label="Release Date" value={movie.releaseDate} />
              <InfoItem icon={<FaClock />} label="Runtime" value={`${movie.runtime} min`} />
              <InfoItem icon={<FaLanguage />} label="Language" value={movie.language} />
              <InfoItem icon={<FaGlobeAmericas />} label="Country" value={movie.country} />
              <InfoItem
                icon={<FaMoneyBillWave />}
                label="Budget"
                value={movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
              />
              <InfoItem
                icon={<FaMoneyBillWave />}
                label="Box Office"
                value={movie.boxOffice ? `$${movie.boxOffice.toLocaleString()}` : "N/A"}
              />
              <InfoItem icon={<FaUserTie />} label="Director" value={movie.director} />
              <InfoItem
                icon={<FaPenFancy />}
                label="Writers"
                value={<span className="break-words max-w-[150px]">{movie.writers?.join(", ")}</span>}
              />
              <InfoItem
                icon={<FaUsers />}
                label="Cast"
                value={<span className="break-words max-w-[150px]">{movie.cast?.join(", ")}</span>}
              />
              <InfoItem
                icon={<FaBuilding />}
                label="Production"
                value={<span className="break-words max-w-[150px]">{movie.productionCompanies?.join(", ")}</span>}
              />
              <InfoItem icon={<FaStar />} label="Age Rating" value={movie.ageRating || "N/A"} />
            </motion.div>
          </article>

          {movie.awards?.length > 0 && (
            <motion.section className="mt-14" variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-5 text-yellow-400 flex items-center gap-3 drop-shadow-md">
                <FaAward /> Awards
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-400 text-lg select-text">
                {movie.awards.map((award, i) => (
                  <li key={i}>
                    <span className="font-semibold text-gray-100">{award.name}</span> ({award.year}) —{" "}
                    {award.category} ({award.result})
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </motion.div>
      </motion.div>

      {youtubeId && (
        <motion.section
          className="mt-20 max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-yellow-400"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h2 className="text-4xl font-extrabold mb-8 text-center text-yellow-400 drop-shadow-lg">
            🎥 Trailer
          </h2>
          <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
              frameBorder={0}
            />
          </div>
        </motion.section>
      )}

      {similar.length > 0 && (
        <motion.section
          className="mt-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">🎬 Similar Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {similar.map((m) => (
              <Link
                to={`/movies/${m.id}`}
                key={m.id}
                className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-all shadow-lg group"
              >
                <img
                  src={m.image}
                  alt={m.title}
                  className="w-full h-40 sm:h-48 md:h-64 object-cover rounded-lg mb-4 transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="text-xl font-semibold text-yellow-300 group-hover:underline transition-all duration-300 truncate" title={m.title}>
                  {m.title}
                </h3>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </section>
  );

  // Render conditionally
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

const InfoItem = ({ icon, label, value }) => (
  <motion.div
    className="flex items-center gap-3 text-lg hover:text-yellow-400 cursor-default transition-colors select-text"
    variants={itemVariants}
    whileHover={{ scale: 1.05 }}
  >
    <span className="text-yellow-400 text-xl flex-shrink-0">{icon}</span>
    <span className="font-semibold">{label}:</span>
    <span className="ml-auto text-gray-300">{value || "N/A"}</span>
  </motion.div>
);

const LoadingSkeleton = () => (
  <section className="max-w-7xl mx-auto p-8 bg-gray-800 rounded-lg animate-pulse flex flex-col md:flex-row gap-6 md:gap-12 min-h-[400px]">
    <div className="bg-gray-700 rounded-xl w-full max-w-sm h-72 md:h-96" />
    <div className="flex-1 space-y-6">
      <div className="h-12 bg-gray-700 rounded w-3/4" />
      <div className="h-6 bg-gray-700 rounded w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-700 rounded" />
        ))}
      </div>
    </div>
  </section>
);

const ErrorFallback = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] text-center text-red-500 space-y-6 p-6">
    <p className="text-xl font-semibold">Oops! {message}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    >
      <FaRedoAlt /> Retry
    </button>
  </div>
);
export default MovieDetails;

