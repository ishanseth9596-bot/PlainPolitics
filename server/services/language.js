import { LanguageServiceClient } from "@google-cloud/language";

const client = new LanguageServiceClient();

/**
 * Preprocess text using Google Natural Language API to extract entities and sentiment.
 */
export const analyzeCivicIntent = async (text) => {
  if (!process.env.GOOGLE_CLOUD_PROJECT || process.env.NODE_ENV === "test") {
    return {
      sentiment: "neutral",
      entities: ["voting", "election"],
      categories: ["Civic Process"]
    };
  }

  try {
    const document = { content: text, type: "PLAIN_TEXT" };
    const [result] = await client.analyzeEntities({ document });
    const entities = result.entities.map(e => e.name);
    
    const [sentimentResult] = await client.analyzeSentiment({ document });
    const sentiment = sentimentResult.documentSentiment.score > 0.2 ? "positive" : (sentimentResult.documentSentiment.score < -0.2 ? "negative" : "neutral");

    return { entities, sentiment };
  } catch (err) {
    console.error("❌ Natural Language API Error:", err.message);
    return { entities: [], sentiment: "neutral" };
  }
};
