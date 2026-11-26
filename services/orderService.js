const Address = require("../models/Address");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { NotFoundError, ValidationError } = require("../utils/errors");
const logger = require("../utils/logger");

const MAX_QTY_PER_PRODUCT = 10;
const DELIVERY_FEE = 40;
const FREE_DELIVERY_ABOVE = 499;
const COD_FEE = 25;
const GST_RATE = 18; // percent, treated as already included in the price

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

// OM_ + country(2) + state(2) + pin(4) + YYMMDD(6) + timestamp(13)
function generateOrderId(country, state, pincode) {
  const date = new Date();
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const time = String(date.getTime());

  const letters = (str) =>
    String(str)
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 2)
      .toUpperCase()
      .padEnd(2, "X");

  const pin = String(pincode).slice(-4);

  return `OM_${letters(country)}${letters(state)}${pin}${year}${month}${day}${time}`;
}

class OrderService {
  static async addOrder(orderData, userId) {
    try {
      const { items, addressId, paymentMethod, couponCode, notes } = orderData;

      // address must exist and belong to this user
      const address = await Address.findOne({ _id: addressId, userId });
      if (!address) throw new NotFoundError("Delivery address not found");

      // validate lines, and total the units per product
      // (lines stay separate so each keeps its own variant)
      const unitsByProduct = new Map();
      const cartItems = items.map((item) => {
        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new ValidationError(
            "Quantity must be a whole number of at least 1",
          );
        }
        if (!OBJECT_ID_REGEX.test(String(item.productId))) {
          throw new ValidationError("Invalid product");
        }
        const key = String(item.productId);
        unitsByProduct.set(key, (unitsByProduct.get(key) ?? 0) + quantity);
        return { ...item, quantity };
      });

      // 1) per-order limit, on the combined total per product
      for (const units of unitsByProduct.values()) {
        if (units > MAX_QTY_PER_PRODUCT) {
          throw new ValidationError(
            `You can order at most ${MAX_QTY_PER_PRODUCT} units of a product`,
          );
        }
      }

      // load products in one query
      const productIds = [...unitsByProduct.keys()];
      const products = await Product.find({ _id: { $in: productIds } });
      const productMap = new Map(products.map((p) => [String(p._id), p]));

      // 2) limit across this user's unfinished orders
      const activeMap = await Order.getActiveUnitsByProduct(userId, productIds);

      const orderItems = cartItems.map((item) => {
        const p = productMap.get(String(item.productId));
        if (!p) throw new NotFoundError(`Product ${item.productId} not found`);

        const units = unitsByProduct.get(String(p._id));
        const allowed =
          MAX_QTY_PER_PRODUCT - (activeMap.get(String(p._id)) ?? 0);

        if (units > allowed) {
          throw new ValidationError(
            allowed <= 0
              ? `You can't place more orders for ${p.productName} until earlier ones are delivered`
              : `You can order only ${allowed} more of ${p.productName} (limit ${MAX_QTY_PER_PRODUCT} across undelivered orders)`,
          );
        }
        if (p.stock < units) {
          throw new ValidationError(
            `Only ${p.stock} left in stock for ${p.productName}`,
          );
        }

        return {
          productId: p._id,
          quantity: item.quantity,
          variant: item.variant,
          name: p.productName,
          image: p.productImage?.[0]?.url,
          mrp: p.mrp,
          price: p.offerPrice,
        };
      });

      // totals (always calculated on the server)
      const mrpTotal = orderItems.reduce((s, i) => s + i.mrp * i.quantity, 0);
      const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
      const productDiscount = mrpTotal - subtotal;

      // TODO: validate couponCode against the Coupon model and compute this
      const couponDiscount = 0;

      const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
      const codFee = paymentMethod === "cod" ? COD_FEE : 0;
      const total = Math.max(
        0,
        subtotal - couponDiscount + deliveryFee + codFee,
      );
      const gstIncluded = Math.round(total - total / (1 + GST_RATE / 100));

      const orderId = generateOrderId("India", address.state, address.pincode);

      // reserve stock atomically, then create the order;
      // undo the reservation if anything fails
      const reserved = [];
      try {
        for (const [productId, units] of unitsByProduct) {
          const result = await Product.updateOne(
            { _id: productId, stock: { $gte: units } },
            { $inc: { stock: -units, ordered: units } },
          );
          if (result.modifiedCount !== 1) {
            const p = productMap.get(productId);
            throw new ValidationError(
              `${p.productName} just went out of stock, please update your cart`,
            );
          }
          reserved.push([productId, units]);
        }

        const created = await Order.create({
          userId,
          orderId,
          items: orderItems,
          addressId,
          shippingAddress: {
            label: address.label,
            name: address.name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          },
          paymentMethod,
          couponCode,
          notes,
          mrpTotal,
          productDiscount,
          couponDiscount,
          deliveryFee,
          codFee,
          gstIncluded,
          total,
        });

        logger.info(`Order created: ${created._id}`);
        return orderId;
      } catch (err) {
        await Promise.all(
          reserved.map(([id, units]) =>
            Product.updateOne(
              { _id: id },
              { $inc: { stock: units, ordered: -units } },
            ),
          ),
        );
        throw err;
      }
    } catch (error) {
      logger.error("Ordering error:", error);
      throw error;
    }
  }

  static async fetchSingleOrder(userId, orderId) {
    try {
      const singleOrder = await Order.find({ userId, orderId });

      if (!singleOrder) {
        throw new NotFoundError("Order not found");
      }

      logger.info("Order send:", singleOrder);
      return singleOrder;
    } catch (error) {
      logger.error("Fetch single order error:", error);
      throw error;
    }
  }
}

module.exports = OrderService;
