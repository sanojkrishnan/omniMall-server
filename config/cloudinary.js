// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const config = require("./config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, jpg, png, webp images are allowed"), false);
  }
};

cloudinary.config({
  cloud_name: config.CLOUDINARY_SECRET.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_SECRET.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_SECRET.CLOUDINARY_API_SECRET,
});

// factory so each domain (profiles, products, categories) gets its own folder + crop
const makeUploader = ({
  folder,
  width,
  height,
  crop = "fill",
  gravity,
  maxSizeMB = 2,
}) => {
  const transformation = { width, height, crop };
  if (gravity) transformation.gravity = gravity;

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [transformation],
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};

const uploadUserImage = makeUploader({
  folder: "user_profiles",
  width: 500,
  height: 500,
  crop: "fill",
  gravity: "face",
});
const uploadProductImage = makeUploader({
  folder: "products",
  width: 1280,
  height: 720,
  crop: "fill",
  gravity: "auto",
});
const uploadCategoryImage = makeUploader({
  folder: "categories",
  width: 740,
  height: 1300,
  crop: "fill",
  gravity: "auto",
});

module.exports = {
  cloudinary,
  uploadUserImage,
  uploadProductImage,
  uploadCategoryImage,
};
