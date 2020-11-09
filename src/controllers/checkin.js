import HttpStatus from "http-status-codes"
import checkinService from "../services/checkin"
import requestUtils from "../utils/request"

const checkinController = {
  getCheckins: async (req, res, next) => {
    const userId = requestUtils.getLoggedUserId(req)
    try {
      const response = await checkinService.getCheckin({
        user: userId,
      })
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  addCheckin: async (req, res, next) => {
    const userId = requestUtils.getLoggedUserId(req)
    const sectionId = req.body.section
    try {
      const response = await checkinService.createCheckin(userId, sectionId)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  getCheckin: async (req, res, next) => {
    const { id } = req.params
    try {
      const reservation = await checkinService.getCheckinById(id)
      res.status(HttpStatus.OK).json(reservation)
    } catch (error) {
      next(error)
    }
  },
  removeCheckin: async (req, res, next) => {
    const userId = requestUtils.getLoggedUserId(req)
    try {
      const reservation = await checkinService.deleteCheckin(userId)
      res.status(HttpStatus.OK).json(reservation)
    } catch (error) {
      next(error)
    }
  },
}

export default checkinController
