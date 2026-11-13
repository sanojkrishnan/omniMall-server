const Address = require("../models/Address");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const logger = require("../utils/logger");

class AddressService {
  static async fetchAddress(userId) {
    try {
      const addressWithUserId = await Address.find({ userId });

      const address = addressWithUserId.map((item) => item.getPublicProfile());

      return address;
    } catch (error) {
      logger.error("Address fetching error:", error);
      throw error;
    }
  }
  static async addAddress(addressData, userId) {
    try {
      const address = await Address.find({ userId });

      if (address.length === 3) {
        throw new ConflictError("Only 3 address allowed");
      }

      const addressWithUser = { ...addressData, userId: userId };

      await Address.create(addressWithUser);

      return addressWithUser;
    } catch (error) {
      logger.error("Address fetching error:", error);
      throw error;
    }
  }
}

module.exports = AddressService;
