import HttpStatus from "http-status-codes"
import reservationModel from "../models/reservation"
import sectionService from "./section"
import HttpError from "../errors/http"
import moment from "moment"
import _ from "lodash"

const DAYS_WINDOW = 15

const reservationService = {
  createReservation: async (userId, sectionId, date) => {
    const now = moment()
    const twoWeeksFromNow = now.clone().add(DAYS_WINDOW, "days")
    if (!moment(date).isBetween(now, twoWeeksFromNow)) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "La fecha de la reserva debe ser dentro de las próximas dos semanas",
      )
    }
    const section = await sectionService.getSectionById(sectionId)
    if (!section.reservations) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Esta sección no permite reservas",
      )
    }
    const reservations = await reservationService.getReservations({
      user: userId,
      section: sectionId,
    })
    if (reservations.length > 0) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Este usuario ya tiene una reserva para esta sección",
      )
    }
    const occupation = await reservationService.getOccupation(sectionId, date)
    if (occupation + 1 > section.capacity) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Esta sección llegó al límite de su capacidad",
      )
    }
    const reservation = await reservationModel.create({
      user: userId,
      section: sectionId,
      date,
    })
    return reservation.toJSON()
  },
  getReservationById: async (id) => {
    const reservation = await reservationModel.findById(id)
    if (!reservation) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Reservation not found")
    }
    return reservation.toJSON()
  },
  getReservations: async (filters = {}) => {
    let reservations = await reservationModel.find({
      ...filters,
      date: { $gte: new Date() },
    })
    reservations = _.map(reservations, (item) => item.toJSON())
    reservations = await sectionService.getPopulatedSections(reservations)
    return reservations
  },
  getReservationsForUserAndSection: async (userId, sectionId, one = false) => {
    let reservations = await reservationService.getReservations({
      user: userId,
      ...(sectionId && { section: sectionId }),
    })
    if (one) {
      reservations = reservations.length > 0 ? reservations[0] : null
    }
    return reservations
  },
  deleteReservation: async (id) => {
    const reservation = await reservationModel.findByIdAndRemove(id)
    if (!reservation) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Reservation not found")
    }
    return reservation.toJSON()
  },
  getDates: async (sectionId) => {
    const now = moment()
    const lastHour = !now.isSame(now.clone().add(1, "hour"), "day")
    if (lastHour) {
      now.add(1, "hour")
    }
    const dates = Array(DAYS_WINDOW)
      .fill(null)
      .map((_, index) => now.clone().startOf("day").add(index, "day"))
    const occupations = await reservationModel.mapReduce({
      map: function () {
        const { date, section } = this
        if (section.valueOf() === sectionId && date > new Date()) {
          date.setHours(0, 0, 0, 0)
          emit(date, 1)
        }
      },
      reduce: function (_, vals) {
        return Array.sum(vals)
      },
      scope: {
        sectionId,
      },
    })
    const reservations = await sectionService.getReservations(sectionId, true)
    return dates.map((date, index) => {
      const realOccupation =
        occupations.find(({ _id }) => moment(_id).isSame(date, "day"))?.value ??
        0
      const mockOccupation = reservations?.[index] ?? 0
      return {
        date,
        occupation: realOccupation + mockOccupation,
      }
    })
  },
  getTimes: async (sectionId, date) => {
    const now = moment()
    const lastHour = !now.isSame(now.clone().add(1, "hour"), "day")
    let refDate = moment(date).startOf("day")
    const diffFromToday = refDate.diff(now.clone().startOf("day"), "days")
    const isToday = diffFromToday === 0
    if (
      refDate.isBefore(now, "day") ||
      (isToday && lastHour) ||
      diffFromToday > 14
    ) {
      return []
    }
    if (isToday) {
      refDate = now
    }
    const nextDay = refDate
      .clone()
      .add(1, "day")
      .startOf("day")
      .subtract(1, "hour")
    const times = []
    let nextTime = refDate.clone()
    if (!isToday) {
      nextTime.subtract(1, "hour")
    }
    do {
      nextTime = nextTime.clone().add(1, "hour").startOf("hour")
      times.push(nextTime)
    } while (nextTime.isBefore(nextDay))
    const refYear = refDate.year()
    const refMonth = refDate.month()
    const refDay = refDate.date()
    const occupations = await reservationModel.mapReduce({
      map: function () {
        const { section, date } = this
        if (
          section.valueOf() === sectionId &&
          date.getFullYear() === refYear &&
          date.getMonth() === refMonth &&
          date.getDate() === refDay
        ) {
          date.setHours(date.getHours(), 0, 0, 0)
          emit(date, 1)
        }
      },
      reduce: function (_, vals) {
        return Array.sum(vals)
      },
      scope: {
        refYear,
        refMonth,
        refDay,
        sectionId,
      },
    })
    const reservations = (await sectionService.getReservations(sectionId))[
      diffFromToday
    ]
    return times.map((time, index) => {
      const realOccupation =
        occupations.find(({ _id }) => moment(_id).isSame(time, "hour"))
          ?.value ?? 0
      const mockOccupation = reservations?.[24 - times.length + index] ?? 0
      return {
        time,
        occupation: realOccupation + mockOccupation,
      }
    })
  },
  getOccupation: async (sectionId, time) => {
    const refTime = moment(time)
    const refYear = refTime.year()
    const refMonth = refTime.month()
    const refDay = refTime.date()
    const refHours = refTime.hours()
    const diffFromToday = refTime
      .clone()
      .startOf("day")
      .diff(moment().startOf("day"), "days")
    if (diffFromToday > 14) {
      return 0
    }
    const occupations = await reservationModel.mapReduce({
      map: function () {
        const { section, date } = this
        if (
          section.valueOf() === sectionId &&
          date.getFullYear() === refYear &&
          date.getMonth() === refMonth &&
          date.getDate() === refDay &&
          date.getHours() === refHours
        ) {
          emit(date, 1)
        }
      },
      reduce: function (_, vals) {
        return Array.sum(vals)
      },
      scope: {
        refYear,
        refMonth,
        refDay,
        refHours,
        sectionId,
      },
    })
    const reservations = (await sectionService.getReservations(sectionId))[
      diffFromToday
    ]
    const realOccupation = occupations?.[0]?.value ?? 0
    const mockOccupation = reservations?.[refHours] ?? 0
    const occupation = realOccupation + mockOccupation
    return occupation
  },
  clearPastReservations: async () => {
    await reservationModel.remove({
      date: { $lt: new Date() },
    })
  },
  hasReservation: async (userId, sectionId) => {
    const date = moment().startOf("hour")
    const reservation = await reservationModel.findOne({
      user: userId,
      section: sectionId,
      date,
    })
    return reservation !== null
  },
}

export default reservationService
