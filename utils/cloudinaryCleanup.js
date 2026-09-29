const { cloudinary } = require("../config/cloudinary");

const safeDestroy = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary destroy failed:", publicId, err.message);
  }
};

// accepts one multer file or an array of them
const cleanupFiles = async (files) => {
  const list = [].concat(files || []);
  await Promise.all(list.map((f) => safeDestroy(f.filename)));
};

// run fn; if it throws, delete the files multer already pushed to Cloudinary
const withCleanup = async (files, fn) => {
  try {
    return await fn();
  } catch (err) {
    await cleanupFiles(files);
    throw err;
  }
};

module.exports = { safeDestroy, cleanupFiles, withCleanup };