const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: { type: String },
  description: { type: String },
  coverImage: { type: String },
  accentColor: { type: String },
  productIds: [String],
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model("Collection", collectionSchema);