const AdminService = require("../services/adminService");
const ProductService = require("../services/productService");
const {
  paginationValidation,
  productValidation,
} = require("../utils/validation");
const BaseController = require("./BaseController");

class ProductController extends BaseController {
  //add product
  static async addProduct(req, res) {
    try {
      const productInfo = req.query;

      const validatedProduct = BaseController.validateRequest(
        productValidation,
        productInfo,
      );

      const result = await ProductService.addProduct(validatedProduct);
      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  //fetch product
  static async productFetch(req, res) {
    try {
      const pagination = req.query;
      const validatePagination = BaseController.validateRequest(
        paginationValidation,
        pagination,
      );

      const result = await ProductService.fetchProduct({
        validatePagination,
      });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ProductController;
