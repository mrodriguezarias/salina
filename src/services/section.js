import HttpStatus from "http-status-codes"
import sectionModel from "../models/section"
import HttpError from "../errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"
import mongoose from "mongoose"

const sectionService = {
  getSections: async ({ filter = {}, skip, limit } = {}) => {
    const query = sectionModel.find(filter)
    const count = await sectionModel.count(filter)
    let data = await dbUtils.paginate(query, { skip, limit })
    data = _.map(data, (section) => section.toJSON())
    return {
      data,
      count,
    }
  },
  getSectionById: async (id) => {
    const section = await sectionModel.findById(id)
    if (!section) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Section not found")
    }
    return section.toJSON()
  },
  getSectionsForPlace: async (placeId) => {
    let sections = await sectionModel.find({
      place: placeId,
    })
    sections = _.map(sections, (section) => section.toJSON())
    return sections
  },
  sumAttributeForPlace: async (placeId, attribute) => {
    const [{ total }] = await sectionModel.aggregate([
      { $match: { place: mongoose.Types.ObjectId(placeId) } }, // Initial query
      {
        $group: {
          _id: null,
          total: { $sum: `$${attribute}` },
        },
      },
    ])
    return total
  },
  createSection: async (data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Section not provided")
    }
    data = dbUtils.toDocWithLocation(data)
    const section = await sectionModel.create({
      ...data,
    })
    return section.toJSON()
  },
  updateSection: async (id, data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Section not provided")
    }

    const section = await sectionModel.findById(id)
    if (!section) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Section not found")
    }

    data = dbUtils.toDocWithLocation(data)
    const updatedSection = await sectionModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    )
    if (!updatedSection) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Section not found")
    }
    return updatedSection.toJSON()
  },
  deleteSection: async (id) => {
    const section = await sectionModel.findByIdAndRemove(id)
    if (!section) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Section not found")
    }
    return section.toJSON()
  },
  deleteAllSections: async () => {
    const count = await sectionModel.count({})
    if (count > 0) {
      await sectionModel.collection.drop()
    }
  },
}

export default sectionService
