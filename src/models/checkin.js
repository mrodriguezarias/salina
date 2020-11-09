import mongoose from "mongoose"
import dbUtils from "../utils/db"

const checkinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },
  },
  {
    toJSON: dbUtils.toJSON(),
  },
)

const checkinModel = mongoose.model("Checkin", checkinSchema)

export default checkinModel
