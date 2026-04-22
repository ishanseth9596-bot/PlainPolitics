import { createContext, useContext, useState, useCallback } from "react";
import { askAI } from "../services/api";

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const ask = useCallback(async (question) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await askAI(question);
      return data.answer;
    } catch (err) {
      const msg = err.response?.data?.error || "AI is temporarily unavailable.";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AIContext.Provider value={{ ask, loading, error }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
