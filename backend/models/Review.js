const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  medicine_name: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true
  },

  review_text: {
    type: String,
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Review", reviewSchema);