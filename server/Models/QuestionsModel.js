import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnsIndex: {
    type: Number,
    required: true,
  },

});

export default mongoose.model("Questions", questionsSchema);
