import HttpStatus from "http-status-codes"
import reservationService from "../services/reservation"
import requestUtils from "../utils/request"

const reservationController = {
  getReservations: async (req, res, next) => {
    const userId = requestUtils.getLoggedUserId(req)
    const sectionId = req.body.section
    try {
      const response = await reservationService.getReservations({
        user: userId,
        ...(sectionId && { section: sectionId }),
      })
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  addReservation: async (req, res, next) => {
    const userId = requestUtils.getLoggedUserId(req)
    const sectionId = req.body.section
    const date = req.body.date
    try {
      const response = await reservationService.createReservation(
        userId,
        sectionId,
        date,
      )
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  getReservation: async (req, res, next) => {
    const { id } = req.params
    try {
      const reservation = await reservationService.getReservationById(id)
      res.status(HttpStatus.OK).json(reservation)
    } catch (error) {
      next(error)
    }
  },
  removeReservation: async (req, res, next) => {
    const { id } = req.params
    try {
      const reservation = await reservationService.deleteReservation(id)
      res.status(HttpStatus.OK).json(reservation)
    } catch (error) {
      next(error)
    }
  },
  getDates: async (req, res, next) => {
    const { section } = req.body
    try {
      const response = await reservationService.getDates(section)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  getTimes: async (req, res, next) => {
    const { section, date } = req.body
    try {
      const response = await reservationService.getTimes(section, date)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
}

export default reservationController
