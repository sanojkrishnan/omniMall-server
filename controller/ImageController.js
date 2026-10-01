// controllers/imageController.js
const { cloudinary } = require("../config/cloudinary");
const User = require("../models/User");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { safeDestroy, cleanupFiles } = require("../utils/cloudinaryCleanup");

const MAX_PRODUCT_IMAGES = 10;
const toImage = (file) => ({ url: file.path, publicId: file.filename });

//for profile photo uploading (single photo)
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(200).json({ message: "No image provided, skipped" });
    }

    const user = await User.findById(req.user.id);

    // delete old image from cloudinary if exists
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }

    user.profileImage = {
      url: req.file.path, // cloudinary url
      publicId: req.file.filename, // cloudinary public id
    };

    await user.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

//for profile photo deletion (single photo)
const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.profileImage?.publicId) {
      return res.status(400).json({ message: "No profile image to delete" });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(user.profileImage.publicId);

    user.profileImage = { url: null, publicId: null };
    await user.save();

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};

//upload product images (append, up to 10 total)
const saveProductImages = async (req, res) => {
  const files = req.files || [];
  try {
    const { id } = req.params;

    if (files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }
    if (!mongoose.isValidObjectId(id)) {
      await cleanupFiles(files);
      return res.status(400).json({ message: "Invalid product id" });
    }

    const images = files.map(toImage);

    // the filter only matches while the product still has room for these images
    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        [`productImage.${MAX_PRODUCT_IMAGES - images.length}`]: {
          $exists: false,
        },
      },
      { $push: { productImage: { $each: images } } },
      { new: true },
    );

    if (!product) {
      await cleanupFiles(files);
      const exists = await Product.exists({ _id: id });
      return exists
        ? res.status(400).json({
            message: `A product can have at most ${MAX_PRODUCT_IMAGES} images`,
          })
        : res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product images uploaded successfully",
      productImage: product.productImage,
    });
  } catch (error) {
    await cleanupFiles(files);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

//change one product image (body.publicId = the image to replace)
const changeProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { publicId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }
    if (!publicId || !mongoose.isValidObjectId(id)) {
      await cleanupFiles(req.file);
      return res
        .status(400)
        .json({ message: "Valid product id and publicId are required" });
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, "productImage.publicId": publicId },
      { $set: { "productImage.$": toImage(req.file) } }, // replaces in the same position
      { new: true },
    );

    if (!product) {
      await cleanupFiles(req.file);
      return res.status(404).json({ message: "Product or image not found" });
    }

    await safeDestroy(publicId); // old image, only after the update succeeded

    res.status(200).json({
      message: "Product image changed successfully",
      productImage: product.productImage,
    });
  } catch (error) {
    await cleanupFiles(req.file);
    res.status(500).json({ message: "Change failed", error: error.message });
  }
};

//delete one product image (?publicId=...)
const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { publicId } = req.query; // public ids contain "/", so not a route param

    if (!publicId || !mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: "Valid product id and publicId are required" });
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        "productImage.publicId": publicId,
        "productImage.1": { $exists: true }, // at least 2 images, so one always remains
      },
      { $pull: { productImage: { publicId } } },
      { new: true },
    );

    if (!product) {
      const current = await Product.findById(id).select("productImage").lean();
      if (!current) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (!current.productImage.some((i) => i.publicId === publicId)) {
        return res
          .status(404)
          .json({ message: "Image not found on this product" });
      }
      return res.status(400).json({
        message: "A product must keep at least one image. Change it instead.",
      });
    }

    await safeDestroy(publicId);

    res.status(200).json({
      message: "Product image deleted successfully",
      productImage: product.productImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

module.exports = {
  uploadProfileImage,
  deleteProfileImage,
  saveProductImages,
  changeProductImage,
  deleteProductImage,
};
