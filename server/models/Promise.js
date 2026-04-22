import mongoose from "mongoose";

const promiseSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    detail: { type: String, default: "" },
    category: { type: String, default: "General" },
    status: {
      type: String,
      enum: ["pending", "in_progress", "fulfilled", "broken"],
      default: "pending",
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    deadline: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Promise", promiseSchema);
