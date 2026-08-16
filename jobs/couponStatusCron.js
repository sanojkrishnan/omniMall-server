const cron = require("node-cron"); 
const Coupon = require("../models/Coupon");
const logger = require("../utils/logger");

async function refreshCouponStatuses() {
  const now = new Date();

  try {
    // pending -> active, once the window has opened
    const activated = await Coupon.updateMany(
      { status: "pending", startDate: { $lte: now }, endDate: { $gte: now } },
      { $set: { status: "active" } },
    );

    // pending or active -> inactive, once expired.
    // Deliberately excludes coupons already "inactive" — an admin-paused
    // coupon still inside its date window should not be touched here.
    const expired = await Coupon.updateMany(
      { status: { $in: ["pending", "active"] }, endDate: { $lt: now } },
      { $set: { status: "inactive" } },
    );

    if (activated.modifiedCount || expired.modifiedCount) {
      logger.info(
        `Coupon status sync: ${activated.modifiedCount} activated, ${expired.modifiedCount} expired`,
      );
    }
  } catch (error) {
    logger.error("Coupon status cron failed:", error);
  }
}

cron.schedule("* * * * *", refreshCouponStatuses); // every minute

module.exports = { refreshCouponStatuses };
