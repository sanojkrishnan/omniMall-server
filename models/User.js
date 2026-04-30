const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for password encryption

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [15, "Name cannot exceed 15 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
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
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "seller"],
      default: "user",
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is not provided"],
    },
    gender: {
      type: String,
      required: [true, "Gender is not provided"],
      enum: ["male", "female"],
    },
    status: {
      type: String,
      enum: ["active", "banned"],
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
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.statics.findActiveUsers = function () {
  return this.find({ status: "active" });
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model("User", userSchema);
