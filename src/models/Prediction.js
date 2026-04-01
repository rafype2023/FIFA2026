import mongoose from "mongoose";

const PredictionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  groupPicks: { type: Object },
  bracket: { type: Object, required: true },
  champion: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
