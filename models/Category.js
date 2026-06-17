const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: {
        values: [
          "Electronics",
          "Home Appliances",
          "Beauty",
          "Fashion",
          "Accessories",
          "Beverages",
        ],
        message: "Status must be active or inactive",
      },
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    subCategories: {
      type: [String],
      required: [true, "Sub category is required"],
      default: [],
    },
    availableColors: {
      type: [String],
      required: [true, "Available colors are required"],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be active or inactive",
      },
      default: "active",
    },
    displaySection: {
      type: String,
      enum: {
        values: ["featured", "trending", "new arrivals", "sale"],
        message: "Invalid display section",
      },
      default: "featured",
    },
    gender: {
      type: String,
      enum: {
        values: ["men", "women", "unisex", "kids"],
        message: "Gender must be men, women, unisex or kids",
      },
      required: [true, "Gender is required"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
