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
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [200, "Description cannot exceed 200 characters"],
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
      min: [0, "Stock cannot be negative"],
    },
    mrp: {
      type: Number,
      required: [true, "MRP rate is required"],
      min: [1, "MRP must be greater than 0"],
    },
    offerPrice: {
      type: Number,
      min: [0, "Offer price cannot be negative"],
      required: [true, "Offer price is required"],
      validate: {
        validator: function (value) {
          return value <= this.mrp;
        },
        message: "Offer price must be less than or equal to MRP",
      },
    },
    offerPercentage: {
      type: Number,
      default: 0,
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
          message: "You can upload a maximum of 10 images",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function (next) {
  if (this.mrp > 0) {
    this.offerPercentage = Math.round(
      ((this.mrp - this.offerPrice) / this.mrp) * 100,
    );
  }
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.mrp && update.offerPrice) {
    update.offerPercentage = Math.round(
      ((update.mrp - update.offerPrice) / update.mrp) * 100,
    );
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
