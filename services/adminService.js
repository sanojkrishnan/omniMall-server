const logger = require("../utils/logger");
const Product = require("../models/Product");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const Category = require("../models/Category");
const {
  AuthenticationError,
  ValidationError,
  ConflictError,
  NotFoundError,
} = require("../utils/errors");
const { safeDestroy } = require("../utils/cloudinaryCleanup"); // adjust if safeDestroy lives elsewhere

const COUPON_SORT_MAP = {
  newest: { startDate: -1 },
  oldest: { startDate: 1 },
  endDate_asc: { endDate: 1 },
  endDate_desc: { endDate: -1 },
};

class AdminService {
  // admin confirm: called at the top of every method below
  static async adminConfirm(adminId) {
    const admin = await User.findById(adminId).select("role").lean();

    if (!admin || admin.role !== "admin")
      throw new AuthenticationError("Only admins can access this feature");

    console.log("ADMIN CHECK :", admin.role);
  }

  // DASHBOARD
  static async dashboardFetch(adminId) {
    try {
      await AdminService.adminConfirm(adminId);

      const [products, categories, coupons] = await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Coupon.countDocuments(),
      ]);
      return { products, categories, coupons };
    } catch (error) {
      logger.error("Dashboard fetch error:", error);
      throw error;
    }
  }

  // COUPON
  static async addCoupon(couponData) {
    try {
      // couponData.createdBy is the admin id set by the controller
      await AdminService.adminConfirm(couponData.createdBy);

      const existingCoupon = await Coupon.findOne({
        $or: [{ code: couponData.code }, { name: couponData.name }],
      })
        .select("code name")
        .lean();

      if (existingCoupon) {
        const field = existingCoupon.code === couponData.code ? "code" : "name";
        throw new ConflictError(
          `A coupon with this ${field} already exists in the database`,
        );
      }

      return await Coupon.create(couponData);
    } catch (error) {
      // race: two requests passed the pre-check, the unique index caught the second
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

  static async updateCoupon({ data, id }, adminId) {
    try {
      await AdminService.adminConfirm(adminId);

      const coupon = await Coupon.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true },
      );
      if (!coupon) throw new NotFoundError("Coupon not found");

      logger.info("Coupon updated:", id);
      return coupon;
    } catch (error) {
      logger.error("Update coupon error:", error);
      throw error;
    }
  }

  // "active" on an expired coupon rolls the window forward 24h,
  // "active" on a pending coupon pulls the start to now,
  // "inactive" never touches dates.
  static async updateCouponStatus({ status, id }, adminId) {
    try {
      await AdminService.adminConfirm(adminId);

      const coupon = await Coupon.findById(id);
      if (!coupon) throw new NotFoundError("Coupon not found");

      const update = { status };

      if (status === "active") {
        const now = new Date();
        if (coupon.endDate < now) {
          update.startDate = now;
          update.endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        } else if (coupon.startDate > now) {
          update.startDate = now;
        }
      }

      const updated = await Coupon.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true, runValidators: true },
      );

      logger.info("Coupon status updated:", id);
      return updated;
    } catch (error) {
      logger.error("Update coupon status error:", error);
      throw error;
    }
  }

  static async deleteCoupon(couponId, adminId) {
    try {
      await AdminService.adminConfirm(adminId);

      const coupon = await Coupon.findByIdAndDelete(couponId);
      if (!coupon) throw new NotFoundError("Coupon not found");

      logger.info("Coupon deleted:", couponId);
      return coupon;
    } catch (error) {
      logger.error("Delete coupon error:", error);
      throw error;
    }
  }

  // CATEGORY
  static async addCategory(data, adminId) {
    try {
      await AdminService.adminConfirm(adminId);

      // case-insensitive duplicate check
      const exists = await Category.exists({ name: data.name }).collation({
        locale: "en",
        strength: 2,
      });
      if (exists) {
        throw new ValidationError("A category with this name already exists.");
      }

      const category = await Category.create(data);
      logger.info("Category added:", category._id);
      return category;
    } catch (error) {
      if (error?.code === 11000) {
        throw new ValidationError("A category with this name already exists.");
      }
      logger.error("Add category error:", error);
      throw error;
    }
  }

  static async updateCategory({ data, id }, adminId) {
    try {
      await AdminService.adminConfirm(adminId);

      const existing = await Category.findById(id).select("categoryImage");
      if (!existing) throw new NotFoundError("Category not found");

      const updated = await Category.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true },
      );

      // old image is removed only after the DB update succeeded
      const oldId = existing.categoryImage?.publicId;
      if (
        data.categoryImage &&
        oldId &&
        oldId !== data.categoryImage.publicId
      ) {
        await safeDestroy(oldId);
      }

      logger.info("Category updated:", id);
      return updated;
    } catch (error) {
      logger.error("Update category error:", error);
      throw error;
    }
  }

  static async deleteCategory(categoryId, adminId) {
    try {
      await AdminService.adminConfirm(adminId);

      const inUse = await Product.exists({ categoryId }); // use your real field name
      if (inUse) {
        throw new ValidationError(
          "This category has products. Move or delete them first.",
        );
      }

      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) throw new NotFoundError("Category not found");

      // DB delete succeeded, so now remove the image (safeDestroy never throws)
      await safeDestroy(category.categoryImage?.publicId);

      logger.info("Category deleted:", categoryId);
      return category;
    } catch (error) {
      logger.error("Delete category error:", error);
      throw error;
    }
  }

  // PRODUCT
  static async deleteProduct(productId, adminId) {
    try {
      await AdminService.adminConfirm(adminId);

      const product = await Product.findByIdAndDelete(productId);
      if (!product) throw new NotFoundError("Product not found");

      logger.info("Product deleted:", productId);
      return product;
    } catch (error) {
      logger.error("Delete product error:", error);
      throw error;
    }
  }
}

module.exports = AdminService;
module.exports.COUPON_SORT_MAP = COUPON_SORT_MAP;
