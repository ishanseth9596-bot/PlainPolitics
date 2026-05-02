import { useState, useEffect } from "react";
import api from "../services/api";

/**
 * Hook to fetch trending political topics from BigQuery analytics.
 */
export const usePoliticalTopics = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/analytics/trending");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return { data, isLoading, error, refetch: fetchTopics };
};
