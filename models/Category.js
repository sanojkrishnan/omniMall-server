const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name must be under 50 characters"],
    },
    categoryImage: {
      url: {
        type: String,
        required: [true, "Category image URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Category image publicId is required"],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
