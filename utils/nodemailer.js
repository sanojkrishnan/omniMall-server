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

//send reset password email
const sendResetEmail = async (email, resetURL) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Link",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetURL}" style="
        background-color: #000;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        margin-top: 10px;
      ">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};

module.exports = {
  sendOTPEmail,
  sendResetEmail,
};
