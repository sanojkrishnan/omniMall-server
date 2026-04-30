// controllers/userController.js
const { cloudinary } = require("../config/cloudinary");
const User = require("../models/User");

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
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

module.exports = {
  uploadProfileImage,
  deleteProfileImage,
};
