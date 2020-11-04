import mongoose from "mongoose"
import dbUtils from "../utils/db"

const sectionSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
      index: true,
    },
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
    reservations: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: dbUtils.toJSON(),
  },
)

const sectionModel = mongoose.model("Section", sectionSchema)

export default sectionModel
