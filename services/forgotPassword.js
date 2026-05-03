class ForgotPasswordService {
  static async forgotPassword(email) {
    const user = await User.findByEmail(email);
    if (!user) throw new NotFoundError("User not found");

    // generate token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // send email with reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendResetEmail(user.email, resetURL); // create this in nodemailer

    return { message: "Password reset link sent to your email" };
  }
  static async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // not expired
    });

    if (!user) throw new AuthenticationError("Invalid or expired reset token");

    user.password = newPassword; // bcrypt hashes in pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password reset successful" };
  }
}
