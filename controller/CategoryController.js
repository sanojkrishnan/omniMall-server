const CategoryService = require("../services/categoryService");
const { isCallForCategory } = require("../utils/validation");
const BaseController = require("./BaseController");

class CategoryController extends BaseController {
  //fetch all category
  static findProductCategory = BaseController.asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const categories = req.body;

    const validatedData = BaseController.validateRequest(
      isCallForCategory,
      categories,
    );
    const result = await CategoryService.findCategory(
      Number(page) || 1,
      Number(limit) || 15,
      validatedData.uniqueCategories,
    );

    BaseController.logAction("SELLER_FETCH_", result.data);

    BaseController.sendSuccess(
      res,
      "Category fetched successfully",
      result,
      200,
    );
  });
}

module.exports = CategoryController;
