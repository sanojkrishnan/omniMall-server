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
      // Pre-check both unique fields — checking only `code` missed `name`
      // collisions, which is what let a raw MongoServerError (E11000 on
      // name_1) escape uncaught instead of surfacing as a clean ConflictError.
      const existingCoupon = await Coupon.findOne({
        $or: [{ code: couponData.code }, { name: couponData.name }],
      });

      if (existingCoupon) {
        const field =
          existingCoupon.code === couponData.code ? "code" : "name";
        throw new ConflictError(
          `A coupon with this ${field} already exists in the database`,
        );
      }

      const coupon = await Coupon.create(couponData);
      return coupon;
    } catch (error) {
      // Fallback safety net: if two requests race between the pre-check and
      // the create() call, Mongo's unique index still catches it — convert
      // that raw E11000 into the same clean ConflictError instead of letting
      // it leak to the client as a stack trace.
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || "field";
        logger.error("Add coupon error (race condition):", error);
        throw new ConflictError(
          `A coupon with this ${field} already exists in the database`,
        );
      }

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
        throw new NotFoundError("Coupon not found");
      }

      logger.info("Coupon updated:", id);
      return coupon;
    } catch (error) {
      logger.error("Update coupon error:", error);
      throw error;
    }
  }

  //status updation
  // Toggling to "active":
  //   - if the coupon's window has already expired (endDate < now), roll the
  //     window forward: startDate -> now, endDate -> now + 24h.
  //   - if the coupon is still pending (startDate in the future), pull the
  //     start forward to now, since "active" with a future startDate would
  //     be a lie.
  //   - if already inside its window, leave the dates untouched.
  // Toggling to "inactive" never touches dates — it's just a pause.
  static async updateCouponStatus({ status, id }) {
    try {
      const coupon = await Coupon.findById(id);

      if (!coupon) {
        throw new NotFoundError("Coupon not found");
      }

      const update = { status };

      if (status === "active") {
        const now = new Date();
        const isExpired = coupon.endDate < now;
        const isPending = coupon.startDate > now;

        if (isExpired) {
          update.startDate = now;
          update.endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24h
        } else if (isPending) {
          update.startDate = now;
        }
      }

      const updated = await Coupon.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true, runValidators: true }, // "new: true" — Mongoose's documented option;
        // "returnDocument: after" isn't reliably forwarded to the driver by
        // Mongoose's query layer and could return the pre-update document.
      );

      logger.info("Coupon updated:", id);
      return updated;
    } catch (error) {
      logger.error("Update coupon status error:", error);
      throw error;
    }
  }

  //delete coupon
  static async deleteCoupon(couponId) {
    try {
      const coupon = await Coupon.findByIdAndDelete(couponId);
      if (!coupon) {
        throw new NotFoundError("Coupon not found");
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