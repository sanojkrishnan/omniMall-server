const Category = require("../models/Category");
const logger = require("../utils/logger");

class CategoryService {
  static async findCategory(page = 1, limit = 15, uniqueCategories = []) {
    try {
      uniqueCategories = uniqueCategories ?? [];

      const skip = (page - 1) * limit;
      const filter =
        uniqueCategories.length > 0 ? { _id: { $in: uniqueCategories } } : {};

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
