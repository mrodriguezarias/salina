import HttpStatus from "http-status-codes"
import sectionService from "../services/section"

const sectionController = {
  getSectionsForPlace: async (req, res, next) => {
    try {
      const { placeId } = req.params
      const result = await sectionService.getSectionsForPlace(placeId)
      res.status(HttpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  },
}

export default sectionController
