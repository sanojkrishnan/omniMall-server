// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const config = require("./config");

cloudinary.config({
  cloud_name: config.CLOUDINARY_SECRET.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_SECRET.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_SECRET.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "fill" }], // auto resize
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = { cloudinary, upload };
