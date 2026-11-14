// controller/index.js
const AuthController = require("./AuthController");
const CartController = require("./CartController");
const ImageController = require("./ImageController");
const AdminController = require("./AdminController");
const CategoryController = require("./CategoryController");
const CouponController = require("./CouponController");
const ProductController = require("./ProductController");
const SellerController = require("./SellerController");
const AddressController = require("./AddressController");

module.exports = {
  register: AuthController.register,
  login: AuthController.login,
  verifyOTP: AuthController.verifyOTP,
  resendOTP: AuthController.resendOTP,
  forgotPassword: AuthController.forgotPassword,
  resetPassword: AuthController.resetPassword,
  googleAuth: AuthController.googleAuth,
  googleProfileCompletion: AuthController.googleProfileCompletion,
  updateProfile: AuthController.updateProfile,

  //cart
  fetchCart: CartController.fetchCart,
  addCart: CartController.addCart,
  removeCart: CartController.removeCart,
  updateProductQuantity: CartController.updateProductQuantity,

  //admin
  updateCoupon: AdminController.updateCoupon,
  deleteCoupon: AdminController.deleteCoupon,
  updateCouponStatus: AdminController.updateCouponStatus,
  addCoupon: AdminController.addCoupon,
  updateCategory: AdminController.updateCategory,
  deleteCategory: AdminController.deleteCategory,
  addCategory: AdminController.addCategory,
  dashboard: AdminController.dashboard,
  deleteProduct: AdminController.deleteProduct,

  //category
  findProductCategory: CategoryController.findProductCategory,
  fetchSingleCategory: CategoryController.fetchSingleCategory,

  //coupon
  couponFetch: CouponController.couponFetch,
  singleCouponFetch: CouponController.singleCouponFetch,

  //image
  uploadProfileImage: ImageController.uploadProfileImage,
  deleteProfileImage: ImageController.deleteProfileImage,
  changeProductImage: ImageController.changeProductImage,
  deleteProductImage: ImageController.deleteProductImage,
  saveProductImages: ImageController.saveProductImages,

  //product
  productFetch: ProductController.productFetch,
  addProduct: ProductController.addProduct,
  fetchSingleProduct: ProductController.fetchSingleProduct,
  updateProduct: ProductController.updateProduct,

  //seller
  findProductSeller: SellerController.findProductSeller,
  fetchSingleSeller: SellerController.fetchSingleSeller,
  becomeSeller: SellerController.becomeSeller,

  //address
  fetchAddress: AddressController.fetchAddress,
  addAddress: AddressController.addAddress,
  makeDefaultAddress: AddressController.makeDefaultAddress,
};
