const logger = require("../utils/logger");
const { NotFoundError, ConflictError } = require("../utils/errors");
const Coupon = require("../models/Coupon");

const COUPON_SORT_MAP = {
  newest: { startDate: -1 },
  oldest: { startDate: 1 },
  endDate_asc: { endDate: 1 },
  endDate_desc: { endDate: -1 },
};

class CouponService {
  //coupon fetch
  static async couponFetch({
    page = 1,
    limit = 15,
    search = "",
    sort = "newest",
    adminId,
  }) {
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

  //add coupon
  static async addCoupon(couponData) {
    try {
      const existingCoupon = await Coupon.findOne({ code: couponData.code });

      if (existingCoupon) {
        throw new ConflictError(
          "This coupon code already exists in the database",
        );
      }

      const coupon = await Coupon.create(couponData);
      return coupon;
    } catch (error) {
      logger.error("Add coupon error:", error);
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

  //update coupon
  static async updateCoupon({ data, id }) {
    try {
      const coupon = await Coupon.findByIdAndUpdate(
        id,
        {
          $set: data,
        },
        {
          new: true, // return updated document
          runValidators: true, // apply schema validations
        },
      );

      if (!coupon) {
        throw new Error("Coupon not found");
      }

      logger.info("Coupon updated:", id);
      return coupon;
    } catch (error) {
      logger.error("Update coupon error:", error);
      throw error;
    }
  }
  //status updation
  static async updateCouponStatus({ status, id }) {
    try {
      const coupon = await Coupon.findByIdAndUpdate(
        id,
        { $set: { status } }, //wrap it in an object
        { returnDocument: "after", runValidators: true }, // also fixes the deprecation warning
      );

      if (!coupon) {
        throw new Error("Coupon not found");
      }

      logger.info("Coupon updated:", id);
      return coupon;
    } catch (error) {
      logger.error("Update coupon error:", error);
      throw error;
    }
  }

  //delete coupon
  static async deleteCoupon(couponId) {
    try {
      const coupon = await Coupon.findByIdAndDelete(couponId);
      if (!coupon) {
        throw new Error("Coupon not found");
      }
      logger.info("Coupon deleted:", couponId);
      return coupon;
    } catch (error) {
      logger.error("Delete coupon error:", error);
      throw error;
    }
  }
}

module.exports = CouponService;
