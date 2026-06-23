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
    specSheet: {
      type: [Object],
      require: [true, "Spec sheet is a must"],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
