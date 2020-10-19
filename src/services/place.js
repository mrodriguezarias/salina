import HttpStatus from "http-status-codes"
import placeModel from "../models/place"
import HttpError from "../errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"

const placeService = {
  getPlaces: async () => {
    let places = await placeModel.find({})
    places = _.map(places, (place) => place.toJSON())
    return places
  },
  getPlaceById: async (id) => {
    const place = await placeModel.findById(id)
    if (!place) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Place not found")
    }
    return place.toJSON()
  },
  createPlace: async (data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Place not provided")
    }
    data = dbUtils.toDocWithLocation(data)
    const place = await placeModel.create({
      ...data,
    })
    return place.toJSON()
  },
  updatePlace: async (id, data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Place not provided")
    }

    const place = await placeModel.findById(id)
    if (!place) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Place not found")
    }

    data = dbUtils.toDocWithLocation(data)
    const updatedPlace = await placeModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    )
    if (!updatedPlace) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Node not found")
    }
    return updatedPlace.toJSON()
  },
  deletePlace: async (id) => {
    const place = await placeModel.findByIdAndDelete(id)
    if (!place) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Place not found")
    }
    return place.toJSON()
  },
  deleteAllPlaces: async () => {
    const count = await placeModel.count({})
    if (count > 0) {
      await placeModel.collection.drop()
    }
  },
  checkin: async (id, section, user) => {
    //todo: impact checkin in bd (new collection/s) for user in place/section
    const place = await placeModel.findById(id)
    if (!place) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Place not found for checkin")
    }
    return place.toJSON()
  },
  checkout: async (id, section, user) => {
    //todo: impact checkout in bd (new collection/s) for user in place/section
    const place = await placeModel.findById(id)
    if (!place) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Place not found for checkout")
    }
    return place.toJSON()
  },
}

export default placeService
