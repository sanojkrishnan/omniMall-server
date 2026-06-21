const Category = require("../models/Category");

class CategoryService {
  //fetch all category users
  static async findCategory(page = 1, limit = 15, uniqueCategories = []) {
    try {
      const skip = (page - 1) * limit;

      const filter = { _id: { $in: uniqueCategories } };

      const [category, total] = await Promise.all([
        Category.find(filter).skip(skip).limit(limit),
        Category.countDocuments(filter),
      ]);

      return {
        data: category,
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
      logger.error("Category fetching error:", error);
      throw error;
    }
  }
}

module.exports = CategoryService;
