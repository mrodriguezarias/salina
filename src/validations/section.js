import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const sectionValidation = {
  getSectionsForPlace: {
    params: Joi.object({
      placeId: Joi.string().custom(validationUtils.objectId).required(),
    }),
  },
}

export default sectionValidation
