const User = require("../models/User");
const config = require("../config/config");
const logger = require("../utils/logger");

const seedAdmin = async () => {
  try {
    const adminEmail = config.ADMIN_EMAIL || "admin123@omnimall.com";
    const existingAdmin = await User.findByEmail(adminEmail);

    if (!existingAdmin) {
      const admin = new User({
        name: "Admin",
        email: adminEmail,
        password: config.ADMIN_PASS || "admin123",
        role: "admin",
        status: "active",
      });

      await admin.save();
      logger.info(`Admin user created with email: ${adminEmail}`);
    } else {
      logger.info("Admin user already exists");
    }
  } catch (error) {
    logger.error("Error seeding admin user:", error);
  }
};

//sample user seeding only if the app is under development
const seedSampleUsers = async () => {
  try {
    if (config.NODE_ENV !== "development") {
      return;
    }

    const sampleUsers = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        role: "user",
        gender: "male",
        dateOfBirth: new Date("1990-01-01"),
        status: "active",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "password123",
        role: "seller",
        gender: "female",
        dateOfBirth: new Date("1992-05-15"),
        status: "active",
      },
      {
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob@example.com",
        password: "password123",
        role: "seller",
        gender: "male",
        dateOfBirth: new Date("1990-01-01"),
        status: "banned",
      },
    ];

    for (const userData of sampleUsers) {
      const existingUser = await User.findByEmail(userData.email);
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        logger.info(`Sample user created: ${userData.email}`);
      }
    }
  } catch (error) {
    logger.error("Error seeding sample users:", error);
  }
};

const runSeeders = async () => {
  try {
    await seedAdmin();
    await seedSampleUsers();
    logger.info("Database seeding completed");
  } catch (error) {
    logger.error("Database seeding failed:", error);
  }
};

module.exports = {
  runSeeders,
  seedAdmin,
  seedSampleUsers,
};
