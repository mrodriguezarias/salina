import dbUtils from "../src/utils/db"
import placeService from "../src/services/place"
import sectionService from "../src/services/section"
import consoleUtils from "../src/utils/console"

const BATCH_SIZE = 1024
const RESERVATION_RATIO = 0.4

const addReservations = {
  name: "add_reservations",
  run: async () => {
    await dbUtils.connect(true)
    try {
      // await addReservations.processPlaces()
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
  processPlaces: async () => {
    console.info("Updating places reservation flag…")
    let count = 0
    let batch = 0
    let skip = 0
    do {
      const response = await placeService.getPlaces({
        skip,
        limit: BATCH_SIZE,
      })
      count = response.count
      for (const [index, item] of response.data.entries()) {
        const current = batch * BATCH_SIZE + index + 1
        consoleUtils.printProgress("Processing item", current, count)
        await addReservations.processPlace(item)
      }
      skip += BATCH_SIZE
      batch += 1
    } while (skip < count)
  },
  processPlace: async (place) => {
    const { id, sections } = place
    for (const { name, capacity } of sections) {
      const reservations = Math.random() <= RESERVATION_RATIO
      await sectionService.createSection({
        place: id,
        name,
        capacity,
        reservations,
      })
    }
  },
}

export default addReservations
