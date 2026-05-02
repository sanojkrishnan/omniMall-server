const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("./logger");

// Connect to Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL.EMAIL_USER, //  gmail
    pass: config.EMAIL.EMAIL_PASS, //  App Password
  },
});

// Send the email
const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: "omniMall@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    });
    logger.info(`OTP sent to: ${email}`);
  } catch (error) {
    logger.error(`Failed to send OTP to ${email}:`, error);
    throw new Error("Failed to send OTP email. Please try again later.");
  }
};

module.exports = {
    sendOTPEmail,
}
