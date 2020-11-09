import HttpStatus from "http-status-codes"
import sectionModel from "../models/section"
import HttpError from "../errors/http"
import dbUtils from "../utils/db"
import _ from "lodash"
import checkinService from "./checkin"
import moment from "moment"

const transformSection = async (section) => {
  const occupation = await sectionService.getOccupation(section)
  section = section.toJSON()
  section = {
    ...section,
    occupation,
  }
  return section
}

const transformSections = async (sections) => {
  let transformed = []
  for (let section of sections) {
    section = await transformSection(section)
    transformed = [...transformed, section]
  }
  return transformed
}

const sectionService = {
  getSections: async ({ filter = {}, skip, limit } = {}) => {
    const query = sectionModel.find(filter)
    const count = await sectionModel.count(filter)
    let data = await dbUtils.paginate(query, { skip, limit })
    data = await transformSections(data)
    return {
      data,
      count,
    }
  },
  getSectionById: async (id) => {
    let section = await sectionModel.findById(id)
    if (!section) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Section not found")
    }
    section = await transformSection(section)
    return section
  },
  getSectionsForPlace: async (placeId) => {
    let sections = await sectionModel.find({
      place: placeId,
    })
    sections = await transformSections(sections)
    return sections
  },
  createSection: async (data) => {
    if (_.isEmpty(data)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Section not provided")
    }
    data = dbUtils.toDocWithLocation(data)
    let section = await sectionModel.create({
      ...data,
    })
    section = await transformSection(section)
    return section
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
    let updatedSection = await sectionModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    )
    if (!updatedSection) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Section not found")
    }
    updatedSection = await transformSection(updatedSection)
    return updatedSection
  },
  deleteSection: async (id) => {
    let section = await sectionModel.findByIdAndRemove(id)
    if (!section) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Section not found")
    }
    section = await transformSection(section)
    return section
  },
  deleteAllSections: async () => {
    const count = await sectionModel.count({})
    if (count > 0) {
      await sectionModel.collection.drop()
    }
  },
  getOccupation: async (section) => {
    const checkins = await checkinService.getOccupation(section.id)
    const occupation = section.occupation + checkins
    return occupation
  },
  getReservations: async (sectionId, perDay = false) => {
    const section = await sectionModel.findById(sectionId)
    let reservations = section?.reservations
    if (reservations) {
      reservations = reservations.toObject()
      reservations = reservations.map((reservation) => reservation.toObject())
      const currentHour = moment().hour()
      reservations = reservations.map((day, index) =>
        index > 0
          ? day
          : day.map((hour, index) => (index > currentHour ? hour : 0)),
      )
      if (perDay) {
        reservations = reservations.map((day) => _.sum(day))
      }
    }
    return reservations
  },
  clearOccupations: async () => {
    await sectionModel.updateMany(
      {},
      {
        occupation: 0,
        reservations: null,
      },
    )
  },
}

export default sectionService
