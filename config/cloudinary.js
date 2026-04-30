// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const config = require("./config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only jpeg, jpg, png, webp images are allowed"), false); // reject file
  }
};
//storage config - cloudinary
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
//multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = { cloudinary, upload };
