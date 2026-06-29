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
  //fetch single category with _id
  static async fetchOneCategory(categoryId) {
    try {
      if (!categoryId) {
        throw new Error("Category ID is required");
      }

      const category = await Category.findById(categoryId);

      if (!category) {
        throw new Error("Category not found");
      }

      logger.info("Category send:", category);
      return category;
    } catch (error) {
      logger.error("Fetch category error:", error);
      throw error;
    }
  }
}

module.exports = CategoryService;
