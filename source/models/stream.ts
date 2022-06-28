import mongoose from "mongoose";

const streamSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  streamIds: {
    type: [String],
    required: true,
  },
});

export default mongoose.model("stream", streamSchema);
