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
    console.log("ADDRESS LOG FROM CONTROLLER : ", address);
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
}

module.exports = AddressController;
