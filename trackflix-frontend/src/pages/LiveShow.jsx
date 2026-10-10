import { API_BASE_URL } from "../config";
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import LiveCard from "../components/MoviePages/LiveCard";
import GenreFilter from "../components/MoviePages/GenreFilter";
import Pagination from "../components/MoviePages/Pagination";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LiveShow = () => {
  const query = useQuery();
  const initialQuery = query.get("query") || "";

  const [allMovies, setAllMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [sortType, setSortType] = useState("rating");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 48;

  useEffect(() => {
    setSearchTerm(initialQuery);
    setCurrentPage(1);
  }, [initialQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/livetvshows`);
        setAllMovies(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load shows.");
        setAllMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const allGenres = useMemo(() => {
    if (!Array.isArray(allMovies)) return [];
    if (typeof allMovies.flatMap === "function") {
      return Array.from(new Set(allMovies.flatMap((movie) => movie.genres || []))).sort();
    }
    const genres = allMovies.reduce((acc, movie) => {
      if (Array.isArray(movie.genres)) acc.push(...movie.genres);
      return acc;
    }, []);
    return Array.from(new Set(genres)).sort();
  }, [allMovies]);

  const filteredMovies = useMemo(() => {
    return allMovies
      .filter((movie) =>
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((movie) =>
        selectedGenres.length === 0
          ? true
          : selectedGenres.every((genre) => (movie.genres || []).includes(genre))
      );
  }, [allMovies, searchTerm, selectedGenres]);

  const sortedMovies = useMemo(() => {
    return [...filteredMovies].sort((a, b) => {
      if (sortType === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortType === "releaseDate")
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      return 0;
    });
  }, [filteredMovies, sortType]);

  const totalPages = Math.ceil(sortedMovies.length / itemsPerPage);
  const paginatedMovies = sortedMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setCurrentPage(1);
  };

  return (
    <section className="bg-black min-h-screen pt-28 px-4 md:px-10 text-white">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters Panel */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold" htmlFor="search-input">
              Search
            </label>
            <input
              id="search-input"
              type="text"
              className="w-full px-4 py-2 bg-zinc-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Find a live show..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold" htmlFor="sort-select">
              Sort by
            </label>
            <select
              id="sort-select"
              className="w-full px-4 py-2 bg-zinc-900 text-white rounded-md"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="rating">Rating</option>
              <option value="releaseDate">Release Date</option>
            </select>
          </div>

          <GenreFilter
            allGenres={allGenres}
            selectedGenres={selectedGenres}
            toggleGenre={toggleGenre}
            clearFilters={clearFilters}
          />
        </aside>

        {/* Shows Grid */}
        <main className="flex-1">
          {loading && <p className="text-gray-300">Loading shows...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && paginatedMovies.length === 0 && (
            <p className="text-gray-400">No matching shows found.</p>
          )}

          {!loading && !error && paginatedMovies.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {paginatedMovies.map((movie) => (
                  <LiveCard key={movie.id || movie.title} movie={movie} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>
    </section>
  );
};

export default LiveShow;
