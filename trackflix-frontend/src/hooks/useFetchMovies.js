// src/hooks/useFetchMovies.js
import { useState, useEffect } from "react";

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || "";

const useFetchMovies = (searchTerm) => {
  const [moviesData, setMoviesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchTerm.trim()) return;

      setLoading(true);
      setError(null);
      setMoviesData([]);

      try {
        const pagePromises = Array.from({ length: 20 }, (_, i) =>
          fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
              searchTerm
            )}&type=movie&page=${i + 1}`
          ).then((res) => res.json())
        );

        const searchResults = await Promise.all(pagePromises);
        const allSearchResults = searchResults.flatMap((res) =>
          res.Response === "True" ? res.Search : []
        );

        const detailPromises = allSearchResults.map((movie) =>
          fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&plot=short`
          ).then((res) => res.json())
        );

        const fullMovies = await Promise.all(detailPromises);

        const formatted = fullMovies
          .filter((movie) => movie.Response === "True")
          .map((movie) => ({
            id: movie.imdbID,
            title: movie.Title || "N/A",
            rating: parseFloat(movie.imdbRating) || 0,
            genres: movie.Genre?.split(", ").map((g) => g.trim()) || [],
            releaseDate: movie.Released || "N/A",
            trailer: `https://www.youtube.com/results?search_query=${encodeURIComponent(
              movie.Title + " trailer"
            )}`,
            image:
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Image",
          }));

        setMoviesData(formatted);
      } catch (err) {
        setError("Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm]);

  return { moviesData, loading, error };
};

export default useFetchMovies;
