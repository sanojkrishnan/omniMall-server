const mongoose = require("mongoose");
const generateOTP = require("../utils/generateOtp");
const bcrypt = require("bcrypt");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // for auto delete
  expiresAt: { type: Date, required: true },
  userData: { type: Object, required: true }, //store user data temporarily until OTP is verified
});

//hash otp before saving to database
otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();
  this.otp = await bcrypt.hash(this.otp, 10);
});

module.exports = mongoose.model("OTP", otpSchema);
