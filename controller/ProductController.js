const ProductService = require("../services/productService");
const BaseController = require("./BaseController");
const { withCleanup } = require("../utils/cloudinaryCleanup");
const { ValidationError } = require("../utils/errors");
const {
  productValidation,
  productUpdateValidation,
} = require("../validation/productValidation");
const { paginationValidation } = require("../validation/paginationValidation");
const { validateId } = require("../validation/validationHelper");

class ProductController extends BaseController {
  // add product
  static addProduct = BaseController.asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new ValidationError("At least one product image is required");
    }

    // if validation or the insert fails, the images multer already uploaded are removed
    const result = await withCleanup(req.files, async () => {
      const productInfo = {
        ...req.body,
        productImage: req.files.map((file) => ({
          url: file.path,
          publicId: file.filename,
        })),
      };

      const validatedProduct = BaseController.validateRequest(
        productValidation,
        productInfo,
      );
      return ProductService.addProduct(validatedProduct);
    });

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

    const validateData = BaseController.validateRequest(validateId, { id });

    const result = await ProductService.fetchOneProduct(validateData.id);
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

    const validateData = BaseController.validateRequest(validateId, { id });
    const result = await ProductService.deleteProduct(validateData.id);
    BaseController.logAction("PRODUCT_DELETED", result);

    BaseController.sendSuccess(
      res,
      "Product deleted successfully",
      result,
      200,
    );
  });

  //edit product (text/price fields only, images go through the image endpoints)
  static updateProduct = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = { ...(req.body?.data ?? req.body) }; // works whether the client wraps in { data } or not
    delete data.productImage;

    const validateData = BaseController.validateRequest(
      productUpdateValidation,
      {
        id,
        data,
      },
    );
    const result = await ProductService.updateProduct(validateData);
    BaseController.logAction("PRODUCT_UPDATE", result);
    BaseController.sendSuccess(
      res,
      "Product updated successfully",
      result,
      200,
    );
  });
}

module.exports = ProductController;
