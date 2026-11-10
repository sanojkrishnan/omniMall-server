const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      unique: true,
      minlength: [3, "Store name must be at least 3 characters long"],
    },
    productCategories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Select at least one product category",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    businessEmail: {
      type: String,
      required: [true, "Business email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    businessPhone: {
      type: String,
      required: [true, "Business phone is required"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Invalid phone number"], // same rule as the Yup schema
    },
    businessAddress: {
      type: String,
      required: [true, "Business address is required"],
      trim: true,
    },
    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
      trim: true,
    },
    businessLogo: {
      url: {
        type: String,
        required: [true, "Business logo is required"],
      },
      publicId: {
        type: String, // cloudinary public id for deletion
        required: [true, "Business logo is required"],
      },
    },
    // terms and conditions agreement (conditionCheck on the form)
    conditionCheck: {
      type: Boolean,
      required: [true, "You must agree to the terms and conditions"],
      validate: {
        validator: (v) => v === true,
        message: "You must agree to the terms and conditions",
      },
    },
    termsAcceptedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["approved", "banned", "pending", "rejected", "suspended"],
      default: "pending",
    },
    role: {
      type: String,
      enum: ["seller"],
      default: "seller",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true, // one seller account per user
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    banReason: {
      type: String,
      default: null,
    },
    bannedAt: {
      type: Date,
      default: null,
    },
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

//static method to find all approved sellers
sellerSchema.statics.findApprovedSellers = function () {
  return this.find({ status: "approved" });
};
sellerSchema.methods.getPublicProfile = function () {
  const sellerObject = this.toObject();
  delete sellerObject.businessPhone;
  delete sellerObject.businessAddress;
  delete sellerObject.pickupLocation;
  delete sellerObject.businessLogo.publicId;
  delete sellerObject.userId;
  return sellerObject;
};
//static method to find seller by userId
sellerSchema.statics.findByUser = function (userId) {
  return this.findOne({ userId });
};

module.exports = mongoose.model("Seller", sellerSchema);
