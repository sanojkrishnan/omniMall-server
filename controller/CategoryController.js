const CategoryService = require("../services/categoryService");
const BaseController = require("./BaseController");
const { isCallForCategory } = require("../validation/categoryValidation");
const { validateId } = require("../validation/validationHelper");

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

    const result = await CategoryService.fetchOneCategory(id);
    BaseController.logAction("SINGLE_CATEGORY_FETCH", result);

    BaseController.sendSuccess(
      res,
      "Category fetched according to the id given",
      result,
      200,
    );
  });
}

module.exports = CategoryController;
