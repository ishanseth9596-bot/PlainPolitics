import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    party: { type: String, required: true, trim: true },
    constituency: { type: String, required: true, trim: true },
    manifesto: [
      {
        category: String,
        promise: String,
        detail: String,
      },
    ],
    criminalRecords: { type: Number, default: 0 },
    declaredAssets: { type: String, default: "Not declared" },
    education: { type: String, default: "Not declared" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
