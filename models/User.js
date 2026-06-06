const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [
        function () {
          return this.role !== "admin";
        },
        "First name is required",
      ],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [15, "Name cannot exceed 15 characters"],
    },
    lastName: {
      type: String,
      required: [
        function () {
          return this.role !== "admin" && this.provider === "local";
        },
        "Last name is required",
      ],
      trim: true,
      minlength: [1, "Name must be at least 1 characters long"],
      maxlength: [15, "Name cannot exceed 15 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [
        function () {
          return this.provider === "local";
        },
        "Password is required",
      ],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    dateOfBirth: {
      type: Date,
      required: [
        function () {
          return this.role !== "admin" && this.provider === "local";
        },
        "Date of birth is not provided",
      ],
    },
    gender: {
      type: String,
      required: [
        function () {
          return this.role !== "admin" && this.provider === "local";
        },
        "Gender is not provided",
      ],
      enum: ["male", "female"],
    },
    status: {
      type: String,
      enum: ["active", "banned", "inactive", "incomplete"],
      default: "active",
    },
    banReason: {
      type: String,
      default: null,
    },
    bannedAt: {
      type: Date,
      default: null,
    },
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    profileImage: {
      //image handles here
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String, // cloudinary public id for deletion
        default: null,
      },
    },
    // reset password fields for forgot password functionality
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    //otp verification functionality
    otp: {
      type: String,
    },
    otpValidationExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  {
    timestamps: true,
  },
);
//hash password using bcrypt before saving to database
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});
//hash otp if otp exists
userSchema.pre("save", async function () {
  if (this.isModified("otp") && this.otp) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }
});
//compare provided password with hashed password in database before allowing login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
//returns user data without password field for responses
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};
//static method to find all active users
userSchema.statics.findActiveUsers = function () {
  return this.find({ status: "active" });
};
//static method to find user by email, used for login and other operations
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model("User", userSchema);
