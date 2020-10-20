import HttpStatus from "http-status-codes"
import placeModel from "../models/place"
import HttpError from "../errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"
import geoUtils from "../utils/geo"

const placeService = {
  getPlaces: async ({ filter = {}, skip, limit } = {}) => {
    const query = placeModel.find(filter)
    const count = await placeModel.count(filter)
    let data = await dbUtils.paginate(query, { skip, limit })
    data = _.map(data, (place) => place.toJSON())
    return {
      data,
      count,
    }
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
    const place = await placeModel.findByIdAndRemove(id)
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
  searchPlaces: async (search, { skip = 0, limit = 0 } = {}) => {
    search = new RegExp(`${search}`, "i")
    const query = placeModel.find({
      $or: [{ name: search }, { category: search }, { address: search }],
    })
    let data = await dbUtils.paginate(query, { skip, limit, maxLimit: 50 })
    data = _.map(data, (place) => place.toJSON())
    return data
  },
  locatePlaces: async (bounds) => {
    const { northeast, southwest } = bounds
    const distance = geoUtils.getDistance(northeast, southwest)
    if (distance > 1000) {
      return []
    }
    const places = await placeModel.find({
      location: {
        $geoWithin: {
          $box: [
            [southwest.longitude, southwest.latitude],
            [northeast.longitude, northeast.latitude],
          ],
        },
      },
    })
    return places
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
