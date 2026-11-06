const sharp = require("sharp");
const axios = require("axios");
const { cloudinary } = require("../config/cloudinary");

const processGoogleProfileImage = async (imageUrl) => {
  if (!imageUrl) return null;

  let uploadedResult;

  try {
    // Download Google's profile image.
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 10000,
      maxContentLength: 5 * 1024 * 1024,
      maxBodyLength: 5 * 1024 * 1024,
    });

    // Validate that the response is actually an image.
    const metadata = await sharp(response.data).metadata();

    const allowedFormats = ["jpeg", "png", "webp"];

    if (!allowedFormats.includes(metadata.format)) {
      throw new Error("Unsupported Google profile image format");
    }

    // Resize and compress.
    const processedImage = await sharp(response.data)
      .rotate()
      .resize(256, 256, {
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Upload the processed image to Cloudinary.
    uploadedResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "user_profiles",
          resource_type: "image",
          format: "webp",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      stream.end(processedImage);
    });

    return {
      url: uploadedResult.secure_url,
      publicId: uploadedResult.public_id,
    };
  } catch (error) {
    // Remove an uploaded image if a later operation fails.
    if (uploadedResult?.public_id) {
      await cloudinary.uploader.destroy(uploadedResult.public_id);
    }

    throw error;
  }
};

module.exports = processGoogleProfileImage;
