// src/hooks/useLiveShowDetails.js
import { API_BASE_URL } from "../config";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useLiveShowDetails(id) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovie = useCallback(async () => {
    if (!/^\d+$/.test(id)) {
      setError("Invalid movie ID");
      setLoading(false);
      setMovie(null);
      return;
    }

    setLoading(true);
    setError(null);
    setMovie(null);

    const source = axios.CancelToken.source();

    try {
      const { data } = await axios.get(`${API_BASE_URL}/liveshows/${id}`, {
        cancelToken: source.token,
      });

      // Normalize awards
      if (typeof data.awards === "string" && data.awards.trim() !== "") {
        data.awardsText = data.awards;
        data.awards = [];
      }

      setMovie(data);
    } catch (err) {
      if (axios.isCancel(err)) {
        // Request canceled, do nothing
        return;
      }
      if (err.response?.status === 404) {
        setError("Movie not found");
      } else {
        setError("Failed to fetch movie");
      }
      setMovie(null);
    } finally {
      setLoading(false);
    }

    return () => {
      source.cancel("Component unmounted");
    };
  }, [id]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  return { movie, loading, error, refetch: fetchMovie };
}
