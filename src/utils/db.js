import mongoose from "mongoose"
import envUtils from "../utils/env"
import _ from "lodash"

const options = {
  useMongoClient: true,
  family: 4,
}

const dbUtils = {
  connect: async (wait = false) => {
    let connected = false
    const doConnect = () => {
      const {
        MongoHost,
        MongoPort,
        MongoDatabase,
        MongoUser,
        MongoPassword,
      } = envUtils.getAll()
      const url = `mongodb://${MongoUser}:${MongoPassword}@${MongoHost}:${MongoPort}/${MongoDatabase}`
      mongoose.Promise = global.Promise
      mongoose.connect(url, options)
      mongoose.connection.on("error", function (error) {
        console.error(error)
      })
      mongoose.connection.once("open", (connection) => {
        console.info("Connected to database")
        connected = true
      })
      return mongoose.connection
    }
    if (!wait) {
      return doConnect()
    }
    return new Promise(function (resolve) {
      doConnect()
      ;(function waitForConnection() {
        if (connected) {
          return resolve()
        }
        setTimeout(waitForConnection, 100)
      })()
    })
  },
  disconnect: () => {
    mongoose.disconnect()
  },
  toJSON: ({ hideId = false, next } = {}) => {
    const toJSON = {
      transform: (doc, ret) => {
        for (const key in ret) {
          const value = ret[key]
          if (value instanceof mongoose.Types.ObjectId) {
            ret[key] = value.toString()
          }
          if (_.isPlainObject(value) && value._id) {
            delete ret[key]._id
          }
        }
        if (!hideId) {
          ret.id = ret._id.toString()
        }
        delete ret._id
        delete ret.__v
        if (next) {
          next(ret)
        }
      },
    }
    return toJSON
  },
  toDocWithLocation: ({ location, ...data }) => ({
    ...data,
    location: {
      type: "Point",
      coordinates: [location.longitude, location.latitude],
    },
  }),
}

export default dbUtils
