const mongoose = require("mongoose");

const PAYMENT_METHODS = ["card", "upi", "wallet", "netBanking", "cod"];
const ORDER_STATUS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUS = ["pending", "paid", "failed", "refunded"];

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Minimum quantity is 1"],
      max: [10, "Maximum quantity is 10"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
    variant: {
      size: { type: String, trim: true },
      color: { type: String, trim: true },
    },
    // snapshots taken by the server at order time (never trust the client)
    name: { type: String, trim: true },
    image: { type: String },
    mrp: { type: Number, min: 0 },
    price: { type: Number, min: 0 }, // offer price per unit
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    orderId: {
      type: String,
      required: [true, "orderId is required"],
      unique: true,
      match: /^OM_[A-Z]{4}\d{23}$/,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 1,
        message: "Your cart is empty",
      },
    },

    // addressId from the form
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Select a delivery address"],
    },

    // snapshot of the address, so later edits don't change old orders
    shippingAddress: {
      label: String,
      name: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },

    paymentMethod: {
      type: String,
      enum: {
        values: PAYMENT_METHODS,
        message: "Select a payment method",
      },
      required: [true, "Select a payment method"],
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
      default: "pending",
    },

    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: [3, "Minimum 3 letter is needed"],
      maxlength: [6, "maximum 6 letter is allowed"],
      default: null,
      set: (v) => (v === "" ? null : v),
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Maximum 300 characters"],
      default: "",
    },

    // calculated by the server
    mrpTotal: { type: Number, min: 0, default: 0 },
    productDiscount: { type: Number, min: 0, default: 0 },
    couponDiscount: { type: Number, min: 0, default: 0 },
    deliveryFee: { type: Number, min: 0, default: 0 },
    codFee: { type: Number, min: 0, default: 0 },
    gstIncluded: { type: Number, min: 0, default: 0 },
    total: { type: Number, min: 0, default: 0 },

    status: {
      type: String,
      enum: ORDER_STATUS,
      default: "pending",
    },
  },
  { timestamps: true },
);

orderSchema.index({ userId: 1, createdAt: -1 });

// units of each product in this user's unfinished orders
orderSchema.statics.getActiveUnitsByProduct = async function (
  userId,
  productIds,
) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const objectIds = productIds.map((id) => new mongoose.Types.ObjectId(id));

  const rows = await this.aggregate([
    {
      $match: {
        userId: userObjectId,
        status: { $nin: ["delivered", "cancelled"] },
        "items.productId": { $in: objectIds },
      },
    },
    { $unwind: "$items" },
    { $match: { "items.productId": { $in: objectIds } } },
    { $group: { _id: "$items.productId", units: { $sum: "$items.quantity" } } },
  ]);

  return new Map(rows.map((r) => [String(r._id), r.units]));
};

orderSchema.methods.getPublicProfile = function () {
  const orderObject = this.toObject();
  delete orderObject.userId;
  return orderObject;
};

module.exports = mongoose.model("Order", orderSchema);
