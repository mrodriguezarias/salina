import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const checkinSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  user: Joi.string().custom(validationUtils.objectId),
  section: Joi.string().custom(validationUtils.objectId),
}

const checkinValidation = {
  addCheckin: {
    body: Joi.object({
      section: checkinSchema.section.required(),
    }),
  },
  removeCheckin: {
    body: Joi.object({
      section: checkinSchema.section.required(),
    }),
  },
  getCheckin: {
    params: Joi.object({
      id: checkinSchema.id.required(),
    }),
  },
}

export default checkinValidation
