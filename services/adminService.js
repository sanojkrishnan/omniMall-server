const logger = require("../utils/logger");
const Product = require("../models/Product");
const User = require("../models/User");
const { AuthenticationError } = require("../utils/errors");

class AdminService {
  //fetch dashboard data
  static async dashboardFetch(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      logger.error("Add product error:", error);
      throw error;
    }
  }

  //fetch all seller users
  static async findSeller(adminId, page = 1, limit = 15) {
    try {
      const admin = await User.findById(adminId);

      if (!admin) {
        throw new AuthenticationError("User not found");
      }

      if (admin.role !== "admin") {
        throw new AuthenticationError("Only Admins can access this feature");
      }

      const skip = (page - 1) * limit;

      const [seller, total] = await Promise.all([
        User.find({ role: "seller" }).skip(skip).limit(limit),
        User.countDocuments({ role: "seller" }),
      ]);

      return {
        data: seller,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      logger.error("Seller fetching error:", error);
      throw error;
    }
  }
}

module.exports = AdminService;
