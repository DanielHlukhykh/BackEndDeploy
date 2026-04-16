const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AwardSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      default: "custom",
    },
    targetValue: {
      type: Number,
      default: 100,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
    },
    content: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false },
);

AwardSchema.index({ "$**": "text" });

module.exports = Award = mongoose.model("awards", AwardSchema);
