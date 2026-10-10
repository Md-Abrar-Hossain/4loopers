import { API_BASE_URL } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";

export const useFetchInterests = () => {
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/interests`);
        setInterests(response.data);
      } catch (err) {
        console.error("Error fetching interests:", err);
        setError(err);
      }
    };

    fetchInterests();
  }, []);

  return { interests, error };
};
