import mongoose from "mongoose";

const generatedImgSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    default: Date.now,
  },
});

export default mongoose.model("Generated_Img", generatedImgSchema);
