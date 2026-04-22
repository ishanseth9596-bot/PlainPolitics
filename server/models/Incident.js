import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["stolen_vote", "machine_breakdown", "intimidation", "other"],
      required: true,
    },
    description: { type: String, required: true, maxlength: 500 },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
    boothId: { type: String },
    resolvedAt: { type: Date, default: null },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Incident", incidentSchema);
