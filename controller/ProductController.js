const AdminService = require("../services/adminService");
const ProductService = require("../services/productService");
const { dashboardValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class ProductController extends BaseController {
  //product fetch
  static productFetch = BaseController.asyncHandler(async (req, res) => {

    const result = await ProductService.fetchProduct(validatedData);
    BaseController.logAction("ADD_PRODUCT", result.product);

    BaseController.sendSuccess(res, result, 201);
  });
}

module.exports = ProductController;
