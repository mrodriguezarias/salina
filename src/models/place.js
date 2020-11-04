import mongoose from "mongoose"
import sectionService from "../services/section"
import dbUtils from "../utils/db"

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
})

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: "text",
      required: true,
    },
    category: {
      type: String,
      index: "text",
      required: true,
    },
    address: {
      type: String,
      index: "text",
      required: true,
    },
    location: {
      type: pointSchema,
      index: "2d",
      required: true,
    },
  },
  {
    toJSON: dbUtils.toJSON({
      next: (ret) => {
        const longitude = ret.location.coordinates[0]
        const latitude = ret.location.coordinates[1]
        ret.location = {
          longitude,
          latitude,
        }
      },
    }),
  },
)

const placeModel = mongoose.model("Place", placeSchema)

export default placeModel
