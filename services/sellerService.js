class SellerService {
  //fetch all seller users
  static async findSeller(page = 1, limit = 15, uniqueSellers = []) {
    try {
      const skip = (page - 1) * limit;

      const filter = { role: "seller" };
      if (uniqueSellers.length > 0) {
        filter._id = { $in: uniqueSellers };
      }

      const [seller, total] = await Promise.all([
        User.find(filter).skip(skip).limit(limit),
        User.countDocuments(filter),
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

module.exports = SellerService;