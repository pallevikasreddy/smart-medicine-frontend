const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  company: String,

  active_ingredient: String,

  strength_mg: Number,

  uses: [String],

  conditions: [String],

  average_price_inr: Number,

  effectiveness_score: Number,

  image_url: String,

  notes: String

});

module.exports = mongoose.model("Medicine", medicineSchema);