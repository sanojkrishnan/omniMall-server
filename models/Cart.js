const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    useId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User not found"],
    },
    cart: {
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Seller not found"],
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Product not found"],
      },
      qnty: {
        type: Number,
        required: [true, "How much quantity"],
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
