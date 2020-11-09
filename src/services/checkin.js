import HttpStatus from "http-status-codes"
import sectionService from "./section"
import userService from "./user"
import HttpError from "../errors/http"
import _ from "lodash"
import checkinModel from "../models/checkin"
import reservationService from "./reservation"

const checkinService = {
  createCheckin: async (userId, sectionId) => {
    const section = await sectionService.getSectionById(sectionId)
    const hasReservation = await reservationService.hasReservation(
      userId,
      sectionId,
    )
    if (section.reservations && !hasReservation) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Es necesaria una reserva para acceder a esta sección",
      )
    }
    const occupation = await sectionService.getOccupation(section)
    if (occupation + 1 > section.capacity) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Esta sección llegó al límite de su capacidad",
      )
    }
    const prevCheckin = await checkinService.getCheckin({
      user: userId,
    })
    if (prevCheckin) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `Este usuario ya está en ${
          prevCheckin.section === sectionId ? "esta" : "otra"
        } sección`,
      )
    }
    const checkin = await checkinModel.create({
      user: userId,
      section: sectionId,
    })
    return checkin.toJSON()
  },
  getCheckinById: async (id) => {
    const checkin = await checkinModel.findById(id)
    if (!checkin) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Checkin not found")
    }
    return checkin.toJSON()
  },
  getCheckin: async (filters = {}) => {
    const checkin = await checkinModel.findOne({
      ...filters,
    })
    return checkin?.toJSON() ?? null
  },
  deleteCheckin: async (userId) => {
    const checkin = await checkinService.getCheckin({ user: userId })
    if (checkin) {
      await checkinModel.remove({ _id: checkin.id })
    }
    return checkin
  },
  getOccupation: async (sectionId) => {
    const occupation = await checkinModel.count({
      section: sectionId,
    })
    return occupation
  },
}

export default checkinService
