import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const pointSchema = new Schema({
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

const sectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    occupation: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: dbUtils.toJSON({ hideId: true }),
  },
)

const placeSchema = new Schema(
  {
    name: {
      type: String,
      index: "text",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: pointSchema,
      index: "2dsphere",
      required: true,
    },
    sections: [sectionSchema],
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

const placeModel = model("Place", placeSchema)

export default placeModel
