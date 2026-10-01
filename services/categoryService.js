const Category = require("../models/Category");
const Product = require("../models/Product");
const { safeDestroy } = require("../utils/cloudinaryCleanup");
const { NotFoundError, ValidationError } = require("../utils/errors");
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

  //update category
  static async updateCategory({ data, id }) {
    try {
      const existing = await Category.findById(id).select("categoryImage");
      if (!existing) throw new NotFoundError("Category not found");

      const category = await Category.findByIdAndUpdate(
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

      const categoryReturn = await Category.findById(id);
      logger.info("Category updated:", id);
      return categoryReturn;
    } catch (error) {
      logger.error("Update category error:", error);
      throw error;
    }
  }

  //delete category
  static async deleteCategory(categoryId) {
    try {
      const inUse = await Product.exists({ categoryId: categoryId }); // use your real field name
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

  //add category
  static async addCategory(data) {
    try {
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
      // unique-index race: two requests passed the check at the same time
      if (error?.code === 11000) {
        throw new ValidationError("A category with this name already exists.");
      }
      logger.error("Add category error:", error);
      throw error;
    }
  }
}

module.exports = CategoryService;
