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
    const {
      page,
      limit,
      search,
      category,
      minPrice,
      maxPrice,
      priceSort,
      sort,
    } = req.query;
    const isFeatured = req.query.isFeatured === "true";
    const { uniqueProducts } = req.body;

    const validatePagination = BaseController.validateRequest(
      paginationValidation,
      {
        page,
        limit,
        search,
        category,
        minPrice,
        maxPrice,
        priceSort,
        sort,
        isFeatured,
        ids: uniqueProducts?.length ? uniqueProducts.join(",") : "",
      },
    );
    const result = await ProductService.fetchProduct(validatePagination);

    BaseController.sendSuccess(
      res,
      "Products fetched successfully",
      result,
      200,
    );
  });

  //fetch single product
  static fetchSingleProduct = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("PRODUCT ID :", id);
    const result = await ProductService.fetchOneProduct(id);
    BaseController.logAction("SINGLE_PRODUCT_FETCH", result);

    BaseController.sendSuccess(
      res,
      "Product fetched according to the id given",
      result,
      200,
    );
  });

  // delete product
  static deleteProduct = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await ProductService.deleteProduct(id);
    BaseController.logAction("PRODUCT_DELETED", result);

    BaseController.sendSuccess(res, "Product deleted successfully", 200);
  });
}

module.exports = ProductController;
