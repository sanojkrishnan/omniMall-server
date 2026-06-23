const ProductService = require("../services/productService");
const {
  paginationValidation,
  productValidation,
} = require("../utils/validation");
const BaseController = require("./BaseController");

class ProductController extends BaseController {
  // add product
  static addProduct = BaseController.asyncHandler(async (req, res) => {
    const productInfo = req.body;

    if (!req.files || req.files.length === 0) {
      throw new Error("At least one product image is required");
    }

    productInfo.productImage = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const validatedProduct = BaseController.validateRequest(
      productValidation,
      productInfo,
    );

    const result = await ProductService.addProduct(validatedProduct);

    BaseController.sendSuccess(res, "Product added successfully", result, 201);
  });

  // fetch products
  static productFetch = BaseController.asyncHandler(async (req, res) => {
    const pagination = req.query;

    const validatePagination = BaseController.validateRequest(
      paginationValidation,
      pagination,
    );

    const result = await ProductService.fetchProduct(validatePagination);

    BaseController.sendSuccess(
      res,
      "Products fetched successfully",
      result,
      200,
    );
  });

  // delete product
  static deleteProduct = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await ProductService.deleteProduct(id);
    BaseController.logAction("PRODUCT_DELETED", result);

    BaseController.sendSuccess(
      res,
      "Product deleted successfully",
      { id },
      200,
    );
  });
}

module.exports = ProductController;
