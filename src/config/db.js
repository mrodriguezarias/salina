import dbUtils from "../utils/db"

const dbConfig = {
  configure: () => {
    dbUtils.connect()
  },
}

export default dbConfig
