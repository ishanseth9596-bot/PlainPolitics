import { BigQuery } from "@google-cloud/bigquery";

const bq = new BigQuery();
const DATASET = "plainpolitics_analytics";
const TABLE = "user_queries";

/**
 * Log a user query and AI response to BigQuery for trending topic analysis.
 */
export const logQueryToBigQuery = async (question, categories) => {
  if (!process.env.GOOGLE_CLOUD_PROJECT || process.env.NODE_ENV === "test") {
    console.log("[BIGQUERY] Mock log:", { question, categories });
    return;
  }

  try {
    await bq.dataset(DATASET).table(TABLE).insert([{
      timestamp: bq.timestamp(new Date()),
      question,
      categories,
      user_agent: "plainpolitics-v1"
    }]);
  } catch (err) {
    console.error("❌ BigQuery Logging Error:", err.message);
    // Graceful degradation: don't fail the request if logging fails
  }
};

/**
 * Get trending topics from BigQuery.
 */
export const getTrendingTopics = async () => {
  if (!process.env.GOOGLE_CLOUD_PROJECT || process.env.NODE_ENV === "test") {
    return [
      { topic: "Voting Rights", count: 150 },
      { topic: "Registration Deadlines", count: 120 },
      { topic: "Booth Locations", count: 85 }
    ];
  }

  const query = `
    SELECT topic, COUNT(*) as count 
    FROM \`${process.env.GOOGLE_CLOUD_PROJECT}.${DATASET}.trending_topics\`
    GROUP BY topic 
    ORDER BY count DESC 
    LIMIT 10
  `;

  try {
    const [rows] = await bq.query({ query });
    return rows;
  } catch (err) {
    console.warn("⚠️ BigQuery query failed, returning fallback:", err.message);
    return []; // Return empty list on failure
  }
};
