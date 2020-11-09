import _ from "lodash"
import dbUtils from "../src/utils/db"
import sectionService from "../src/services/section"
import reservationService from "../src/services/reservation"
import consoleUtils from "../src/utils/console"

const BATCH_SIZE = 1024
const RESERVATION_DAYS = 15
const RESERVATION_HOURS = 24
const RESERVATION_RATIO = 0.3

const getRandomArray = ({ length, min, max }) =>
  Array.from({ length }, (i) => _.random(min, max))

const refreshOccupations = {
  name: "refresh_occupations",
  run: async () => {
    await dbUtils.connect(true)
    try {
      await refreshOccupations.clear()
      await refreshOccupations.processSections()
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
  clear: async () => {
    console.info("Clearing previous checkins and reservations")
    await sectionService.clearOccupations()
  },
  processSections: async () => {
    let count = 0
    let batch = 0
    let skip = 0
    do {
      const response = await sectionService.getSections({
        skip,
        limit: BATCH_SIZE,
      })
      count = response.count
      for (const [index, item] of response.data.entries()) {
        const current = batch * BATCH_SIZE + index + 1
        consoleUtils.printProgress("Processing section", current, count)
        await refreshOccupations.processSection(item)
      }
      skip += BATCH_SIZE
      batch += 1
    } while (skip < count)
  },
  processSection: async (section) => {
    const reservation = Math.random() <= RESERVATION_RATIO
    if (reservation) {
      await refreshOccupations.processReservations(section)
    }
    await refreshOccupations.processOccupation(section)
  },
  processOccupation: async (section) => {
    const { id, occupation, capacity } = section
    const remainingCapacity = capacity - occupation
    const newOccupation = _.random(0, remainingCapacity)
    await sectionService.updateSection(id, {
      occupation: newOccupation,
    })
  },
  processReservations: async (section) => {
    const { id, capacity } = section
    const reservations = Array.from({ length: RESERVATION_DAYS }, (i) =>
      getRandomArray({
        length: RESERVATION_HOURS,
        min: 0,
        max: capacity,
      }),
    )
    await sectionService.updateSection(id, {
      reservations,
    })
  },
}

export default refreshOccupations
