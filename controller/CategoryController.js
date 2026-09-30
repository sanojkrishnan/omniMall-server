const CategoryService = require("../services/categoryService");
const BaseController = require("./BaseController");
const {
  isCallForCategory,
  categoryUpdateValidation,
} = require("../validation/categoryValidation");
const { validateId } = require("../validation/validationHelper");
const { ValidationError } = require("../utils/errors");
const { withCleanup } = require("../utils/cloudinaryCleanup");

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

  // delete product
  static deleteCategory = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const validateData = BaseController.validateRequest(validateId, { id });
    const result = await CategoryService.deleteCategory(validateData.id);
    BaseController.logAction("CATEGORY_DELETED", result);

    BaseController.sendSuccess(
      res,
      "Category deleted successfully",
      result,
      200,
    );
  });

  //edit category
  static updateCategory = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await withCleanup(req.file, async () => {
      // multipart sends `data` as a JSON string; also accept flat fields or a JSON body
      let data = req.body?.data ?? req.body ?? {};
      console.log("FILE:", req.file);
      console.log("BODY:", req.body);

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          throw new ValidationError("`data` must be valid JSON");
        }
      }
      data = { ...data };

      // the image only ever comes from the uploaded file, never from the client body
      delete data.categoryImage;
      if (req.file) {
        data.categoryImage = {
          url: req.file.path,
          publicId: req.file.filename,
        };
      }

      const validated = BaseController.validateRequest(
        categoryUpdateValidation,
        {
          id,
          data,
        },
      );
      return CategoryService.updateCategory(validated);
    });

    console.log("CATEGORY FROM UPDATE CATEGORY CONTROLLER :", result);

    BaseController.logAction("CATEGORY_UPDATE", result);
    BaseController.sendSuccess(
      res,
      "Category updated successfully",
      result,
      200,
    );
  });
}

module.exports = CategoryController;
