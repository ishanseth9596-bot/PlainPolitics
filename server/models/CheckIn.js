import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema(
  {
    boothId: { type: String, required: true },
    boothName: { type: String },
    waitTime: { type: Number, required: true, min: 0, max: 300 }, // minutes
    crowdLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("CheckIn", checkInSchema);
