const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ["home", "work", "other"],
      required: [true, "Give a label"],
    },

    name: {
      type: String,
      trim: true,
      required: [true, "Enter the full name"],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    phone: {
      type: String,
      trim: true,
      required: [true, "Phone number is required"],
      match: /^\+?[\d\s-]{10,15}$/,
    },

    line1: {
      type: String,
      trim: true,
      required: [true, "This is a part of your address"],
    },

    line2: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      required: [true, "This is a part of your address"],
    },

    state: {
      type: String,
      trim: true,
      required: [true, "This is a part of your address"],
    },

    pincode: {
      type: String,
      required: [true, "Pin code is required"],
      match: [/^\d{6}$/, "Pin code must be 6 digits"],
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

addressSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } },
);

addressSchema.methods.getPublicProfile = function () {
  const addressObject = this.toObject();
  delete addressObject.userId;
  return addressObject;
};

module.exports = mongoose.model("Address", addressSchema);
