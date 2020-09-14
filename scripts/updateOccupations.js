import _ from "lodash"
import dbUtils from "../src/utils/db"
import placeService from "../src/services/place"
import util from "util"

// TODO

const updateOccupations = {
  name: "update-occupations",
  run: async () => {
    await dbUtils.connect(true)
    try {
      const places = await placeService.getPlaces()
      console.log(util.inspect(places, false, null, true))
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
}

export default updateOccupations
