import { useState, useCallback } from "react";
import api from "../services/api";

/**
 * Hook for translating text using Google Cloud Translate.
 */
export const useTranslation = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const translate = useCallback(async (text, targetLang) => {
    if (!text) return;
    setIsLoading(true);
    setError(null);
    try {
      // Assuming a generic /translate endpoint or similar service
      const response = await api.post("/ai/translate", { text, targetLang });
      if (response.data.success) {
        setData(response.data.data.translatedText);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, translate };
};
