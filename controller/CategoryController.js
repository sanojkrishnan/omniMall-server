const CategoryService = require("../services/categoryService");
const BaseController = require("./BaseController");
const {
  isCallForCategory,
  categoryUpdateValidation,
} = require("../validation/categoryValidation");
const { validateId } = require("../validation/validationHelper");
const { ValidationError } = require("../utils/errors");

class CategoryController extends BaseController {
  static findProductCategory = BaseController.asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const categories = req.body ?? {};

    const validatedData =
      BaseController.validateRequest(isCallForCategory, categories) ?? {};

    const result = await CategoryService.findCategory(
      Number(page) || 1,
      Number(limit) || 15,
      validatedData.uniqueCategories || [],
    );

    BaseController.logAction("CATEGORY_FETCH", result.data);

    BaseController.sendSuccess(
      res,
      "Category fetched successfully",
      result,
      200,
    );
  });
  //fetch single category
  static fetchSingleCategory = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const validatedData = BaseController.validateRequest(validateId, { id });

    const result = await CategoryService.fetchOneCategory(validatedData.id);
    BaseController.logAction("SINGLE_CATEGORY_FETCH", result);

    BaseController.sendSuccess(
      res,
      "Category fetched according to the id given",
      result,
      200,
    );
  });

  //edit category
  static updateCategory = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    // if (!req.files || req.files.length === 0) {
    //   throw new ValidationError("Category image is required");
    // }

    // categoryInfo.categoryImage = req.files.map((file) => ({
    //   url: file.path,
    //   publicId: file.filename,
    // }));

    const validateData = BaseController.validateRequest(
      categoryUpdateValidation,
      {
        id,
        data,
      },
    );
    const result = await CategoryService.updateCategory(validateData);
    BaseController.logAction("CATEGORY_UPDATE", result);
    BaseController.sendSuccess(res, "Category updated successfully", 200);
  });
}

module.exports = CategoryController;
