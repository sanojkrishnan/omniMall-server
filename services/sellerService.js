const Seller = require("../models/Seller");
const User = require("../models/User");
const logger = require("../utils/logger");
const {
  ConflictError,
  NotFoundError,
  AuthenticationError,
} = require("../utils/errors");
const { generateSellerToken } = require("../utils/jwt");

class SellerService {
  //register a new seller

  static async register(sellerData, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError("User not found");
      if (user.status !== "active") {
        throw new AuthenticationError(
          "Your account cannot apply to become a seller",
        );
      }
      if (user.role !== "user") {
        throw new ConflictError(
          "Only regular user accounts can apply to become a seller",
        );
      }

      const existing = await Seller.findOne({
        $or: [
          { userId },
          { storeName: sellerData.storeName },
          { businessEmail: sellerData.businessEmail },
          { businessPhone: sellerData.businessPhone },
        ],
      }).select("userId storeName businessEmail businessPhone");

      if (existing) {
        if (String(existing.userId) === String(userId)) {
          throw new ConflictError(
            "You have already submitted a seller request",
          );
        }
        if (existing.storeName === sellerData.storeName) {
          throw new ConflictError("This store name is already taken");
        }
        if (existing.businessEmail === sellerData.businessEmail) {
          throw new ConflictError("This business email is already in use");
        }
        throw new ConflictError("This business phone is already in use");
      }

      let seller;
      try {
        // status is always set by the server
        seller = await Seller.create({
          ...sellerData,
          userId: userId,
          status: "pending",
        });
      } catch (error) {
        if (error.code === 11000) {
          const field = Object.keys(error.keyPattern || {})[0] || "value";
          throw new ConflictError(`This ${field} is already in use`);
        }
        throw error;
      }

      logger.info(`Seller request submitted: ${user.email}`);
      return {
        message:
          "Request to become a seller has been submitted successfully. Please wait for approval.",
        seller: {
          id: seller._id,
          storeName: seller.storeName,
          status: seller.status,
        },
      };
    } catch (error) {
      logger.error("Seller registration error:", error);
      throw error;
    }
  }

  //fetch single seller with _id
  static async fetchOneSeller(userId) {
    try {
      const seller = await Seller.findByUser(userId);

      console.log("SELLER Id: ", userId);

      if (!seller) {
        throw new NotFoundError("Seller not found");
      }

      const tokenPayload = {
        id: seller._id,
        email: seller.businessEmail,
        role: seller.role,
      };

      const token = generateSellerToken(tokenPayload);

      logger.info("Seller send:", seller);
      return { seller: seller.getPublicProfile(), token };
    } catch (error) {
      logger.error("Fetch seller error:", error);
      throw error;
    }
  }

  //fetch all seller users
  static async findSeller(page = 1, limit = 15, uniqueSellers = []) {
    try {
      uniqueSellers = uniqueSellers ?? [];

      const skip = (page - 1) * limit;
      const filter =
        uniqueSellers.length > 0 ? { _id: { $in: uniqueSellers } } : {};

      const [sellers, total] = await Promise.all([
        Seller.find(filter).skip(skip).limit(limit),
        Seller.countDocuments(filter),
      ]);

      return {
        data: sellers,
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
      logger.error("Sellers fetching error:", error);
      throw error;
    }
  }
}

module.exports = SellerService;
