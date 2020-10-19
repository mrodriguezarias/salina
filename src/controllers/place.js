import HttpStatus from "http-status-codes"
import placeService from "../services/place"

const placeController = {
  getPlaces: async (req, res, next) => {
    try {
      const places = await placeService.getPlaces()
      res.status(HttpStatus.OK).json(places)
    } catch (error) {
      next(error)
    }
  },
  getPlaceById: async (req, res, next) => {
    const id = req.params.id
    try {
      const user = await placeService.getPlaceById(id)
      res.status(HttpStatus.OK).json(user)
    } catch (error) {
      next(error)
    }
  },
  createPlace: async (req, res, next) => {
    const data = req.body
    try {
      const response = await placeService.createPlace(data)
      res.status(HttpStatus.CREATED).json(response)
    } catch (error) {
      next(error)
    }
  },
  updatePlace: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      const response = await placeService.updatePlace(id, data)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  deletePlace: async (req, res, next) => {
    const id = req.params.id
    try {
      const response = await placeService.deletePlace(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  },
  checkin: async (req, res, next) => {
    const id = req.params.id
    const section = req.params.section
    const user = req.user
    try {
      const place = await placeService.checkin(id, section, user)
      res.status(HttpStatus.OK).json(place)
    } catch (error) {
      next(error)
    }
  },
  checkout: async (req, res, next) => {s
    const id = req.params.id
    const section = req.params.section
    const user = req.user
    try {
      const place = await placeService.checkout(id, section, user)
      res.status(HttpStatus.OK).json(place)
    } catch (error) {
      next(error)
    }
  },
}

export default placeController
