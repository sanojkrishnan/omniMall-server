const logger = require("../utils/logger");
const Product = require("../models/Product");
const User = require("../models/User");
const { AuthenticationError, NotFoundError } = require("../utils/errors");
const Coupon = require("../models/Coupon");

const COUPON_SORT_MAP = {
  newest: { startDate: -1 },
  oldest: { startDate: 1 },
  endDate_asc: { endDate: 1 },
  endDate_desc: { endDate: -1 },
};

class CouponService {
  //coupon fetch
  static async couponFetch(
    page = 1,
    limit = 15,
    search = "",
    sort = "newest",
    adminId,
  ) {
    try {
      const query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ];
      }

      const sortOption = COUPON_SORT_MAP[sort] || COUPON_SORT_MAP.newest;
      const skip = (page - 1) * limit;

      const [coupons, total] = await Promise.all([
        Coupon.find(query).sort(sortOption).skip(skip).limit(limit),
        Coupon.countDocuments(query),
      ]);

      return {
        coupons,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Fetch coupon error:", error);
      throw error;
    }
  }

  //single coupon fetch
  static async singleCouponFetch(couponId) {
    try {
      const singleCoupon = await Coupon.findById(couponId);

      if (!singleCoupon) {
        throw new NotFoundError("This coupon douse not exist");
      }

      return singleCoupon;
    } catch (error) {
      logger.error("Fetch single coupon error:", error);
      throw error;
    }
  }
}

module.exports = CouponService;
