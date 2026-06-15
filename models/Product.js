const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    brand: {
      type: String,
      required: [true, "Give the brand name"],
    },
    productDesc: {
      type: String,
      required: [true, "Description is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category id is missing"],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: [true, "Seller id is missing"],
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    stock: {
      type: Number,
      required: [true, "Give stock number"],
    },
    mrp: {
      type: Number,
      required: [true, "MRP rate is required"],
    },
    offerPrice: {
      type: Number,
      required: [true, "Offer price is required"],
      validate: {
        validator: function (value) {
          return value <= this.mrp;
        },
        message: "Offer price must be less than or equal to MRP",
      },
    },
    productImage: {
      type: [String],
      required: [true, "Add at least one image of the product"],
      validate: [
        {
          validator: function (value) {
            return value.length >= 1;
          },
          message: "Add at least one image of the product",
        },
        {
          validator: function (value) {
            return value.length <= 10;
          },
          message: "You can upload a maximum of 9 images",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
