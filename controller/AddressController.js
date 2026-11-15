const { AddressService } = require("../services");
const { validateId, addressValidation } = require("../validation");
const BaseController = require("./BaseController");

class AddressController extends BaseController {
  static fetchAddress = BaseController.asyncHandler(async (req, res) => {
    const id = req.user.id;
    const validatedData = BaseController.validateRequest(validateId, {
      id,
    });

    const result = await AddressService.fetchAddress(validatedData.id);

    BaseController.logAction("ADDRESS_FETCH", result);

    BaseController.sendSuccess(
      res,
      "Address fetched successfully",
      result,
      200,
    );
  });

  static addAddress = BaseController.asyncHandler(async (req, res) => {
    const address = req.body;
    const userId = req.user.id;
    const validatedData = BaseController.validateRequest(
      addressValidation,
      address,
    );
    const validatedId = BaseController.validateRequest(validateId, {
      id: userId,
    });
    const result = await AddressService.addAddress(
      validatedData,
      validatedId.id,
    );
    BaseController.logAction("ADDRESS_ADD", result);

    BaseController.sendSuccess(res, "Address added successfully", result, 200);
  });

  static makeDefaultAddress = BaseController.asyncHandler(async (req, res) => {
    const addressId = req.body.addressId;

    const userId = req.user.id;
    const validatedUserId = BaseController.validateRequest(validateId, {
      id: addressId,
    });
    const validatedId = BaseController.validateRequest(validateId, {
      id: userId,
    });
    const result = await AddressService.makeDefaultAddress(
      validatedUserId.id,
      validatedId.id,
    );
    BaseController.logAction("ADDRESS_DEFAULT_CHANGE", result);

    BaseController.sendSuccess(
      res,
      "Default address changed successfully ",
      result,
      200,
    );
  });

  static deleteAddress = BaseController.asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const userId = req.user.id;
    const validatedAddress = BaseController.validateRequest(validateId, {
      id: addressId,
    });
    const validatedId = BaseController.validateRequest(validateId, {
      id: userId,
    });
    const result = await AddressService.deleteAddress(
      validatedAddress.id,
      validatedId.id,
    );
    BaseController.logAction("ADDRESS_DELETED", result);

    BaseController.sendSuccess(
      res,
      "Address deleted successfully",
      result,
      200,
    );
  });

  static updateAddress = BaseController.asyncHandler(async (req, res) => {
    const address = req.body;
    const { addressId } = req.params;
    const userId = req.user.id;

    const validatedAddress = BaseController.validateRequest(validateId, {
      id: addressId,
    });
    const validatedId = BaseController.validateRequest(validateId, {
      id: userId,
    });

    const validatedData = BaseController.validateRequest(
      addressValidation,
      address,
    );
    const result = await AddressService.updateAddress(
      validatedAddress.id,
      validatedId.id,
      validatedData,
    );
    BaseController.logAction("ADDRESS_UPDATED", result);
    0;
    BaseController.sendSuccess(
      res,
      "Address updated successfully",
      result,
      200,
    );
  });
}

module.exports = AddressController;
