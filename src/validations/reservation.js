import { Joi } from "express-validation"
import validationUtils from "../utils/validation"

const reservationSchema = {
  id: Joi.string().custom(validationUtils.objectId),
  date: Joi.date(),
  user: Joi.string().custom(validationUtils.objectId),
  section: Joi.string().custom(validationUtils.objectId),
}

const reservationValidation = {
  addReservation: {
    body: Joi.object({
      section: reservationSchema.section.required(),
      date: reservationSchema.date.required(),
    }),
  },
  getReservations: {
    body: Joi.object({
      section: reservationSchema.section,
    }),
  },
  getReservation: {
    params: Joi.object({
      id: reservationSchema.id.required(),
    }),
  },
  removeReservation: {
    params: Joi.object({
      id: reservationSchema.id.required(),
    }),
  },
  getDates: {
    body: Joi.object({
      section: reservationSchema.section.required(),
    }),
  },
  getTimes: {
    body: Joi.object({
      section: reservationSchema.section.required(),
      date: reservationSchema.date.required(),
    }),
  },
}

export default reservationValidation
