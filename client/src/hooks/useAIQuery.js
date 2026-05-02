import { useState, useCallback } from "react";
import { askAI } from "../services/api";

/**
 * Hook for interacting with the Gemini AI civic assistant.
 * @param {string} initialQuestion - Optional initial question
 * @returns {object} { data, isLoading, error, ask }
 */
export const useAIQuery = (initialQuestion = "") => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const ask = useCallback(async (question) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await askAI(question || initialQuestion);
      // Handle standardized envelope: { success, data: { answer, ... } }
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.error?.message || "AI request failed");
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [initialQuestion]);

  return { data, isLoading, error, ask };
};
