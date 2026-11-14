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
      logger.info("Address Fetched:", address);
      return address;
    } catch (error) {
      logger.error("Address fetching error:", error);
      throw error;
    }
  }
  static async addAddress(addressData, userId) {
    try {
      const existing = await Address.find({ userId });

      if (existing.length >= 3) {
        throw new ConflictError("Only 3 addresses allowed");
      }

      if (existing.some((a) => a.label === addressData.label)) {
        const label =
          addressData.label[0].toUpperCase() + addressData.label.slice(1);
        throw new ConflictError(`Only one ${label} address is allowed`);
      }

      // the first address is always the default
      const makeDefault = existing.length === 0 || !!addressData.isDefault;

      if (makeDefault) {
        await Address.updateMany(
          { userId, isDefault: true },
          { $set: { isDefault: false } },
        );
      }

      const created = await Address.create({
        ...addressData,
        isDefault: makeDefault,
        userId,
      });

      logger.info("Address created:", created);
      return created;
    } catch (error) {
      logger.error("Address adding error:", error);
      throw error;
    }
  }
  static async makeDefaultAddress(addressId, userId) {
    try {
      const address = await Address.findOne({ _id: addressId, userId });

      if (!address) {
        throw new NotFoundError("Address not found");
      }

      if (!address.isDefault) {
        // single round-trip: clear this user's old default, set the new one
        const defaultSet = await Address.bulkWrite([
          {
            updateMany: {
              filter: { userId, isDefault: true },
              update: { $set: { isDefault: false } },
            },
          },
          {
            updateOne: {
              filter: { _id: address._id, userId },
              update: { $set: { isDefault: true } },
            },
          },
        ]);
        logger.info("Address default set:", defaultSet);
        return defaultSet;
      }
    } catch (error) {
      logger.error("Address updating error:", error);
      throw error;
    }
  }
}

module.exports = AddressService;
