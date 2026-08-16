const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      trim: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    discountType: {
      type: String,
      enum: {
        values: ["percentage", "flat"],
        message: "discountType must be either percentage or flat",
      },
      required: [true, "Which discount type"],
    },
    discountValue: {
      type: Number,
      required: [true, "How much discount value"],
      min: [0, "Discount value cannot be negative"],
    },
    maxDiscount: {
      type: Number,
      min: [0, "Max discount cannot be negative"],
      required: [
        function () {
          return this.discountType === "percentage";
        },
        "Max discount is required for percentage-based coupons",
      ],
    },
    minOrderAmount: {
      type: Number,
      required: [true, "Provide the minimum order amount"],
      min: [0, "Minimum order amount cannot be negative"],
    },
    startDate: {
      type: Date,
      required: [true, "When it will start"],
    },
    endDate: {
      type: Date,
      required: [true, "Provide the end date"],
      validate: {
        validator: function (value) {
          return !this.startDate || value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "pending"],
        message: "Status must be active, inactive, or pending",
      },
      default: "pending",
      required: [true, "Status is a must"],
    },
    usageLimit: {
      type: Number,
      required: [true, "Provide a usage limit to the coupon"],
      min: [1, "Usage limit must be at least 1"],
    },
    usagePerUser: {
      type: Number,
      required: [true, "How much a user can access this coupon"],
      min: [1, "Usage per user must be at least 1"],
    },
    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
    applicableCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],
    excludedProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
    sellerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seller" }],
    eligibleUsers: {
      type: String,
      enum: {
        values: ["all", "new", "existing"],
        message: "eligibleUsers must be all, new, or existing",
      },
      required: [true, "Eligible Users are required"],
    },
    paymentMethods: {
      type: [String],
      enum: {
        values: ["COD", "CARD", "UPI"],
        message: "COD, CARD, UPI are the only allowed payment methods",
      },
      default: ["COD", "CARD", "UPI"],
    },
    stackable: {
      type: Boolean,
      default: false,
    },
    autoApply: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Who created this coupon"],
    },
  },
  { timestamps: true },
);

couponSchema.methods.computeStatus = function () {
  const now = new Date();
  if (now < this.startDate) return "pending";
  if (now > this.endDate) return "inactive";
  return "active";
};

// Only auto-derive on creation — updates (including manual toggles) should
// not be silently overwritten by this hook.
couponSchema.pre("save", function (next) {
  if (this.isNew) {
    this.status = this.computeStatus();
  }
});

// Speeds up common "find active, non-expired coupons" queries
couponSchema.index({ status: 1, endDate: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
