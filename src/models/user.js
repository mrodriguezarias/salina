import mongoose from "mongoose"
import dbUtils from "../utils/db"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, index: { unique: true } },
    password: String,
    admin: { type: Boolean, default: false },
  },
  {
    toJSON: dbUtils.toJSON({
      next: (user) => {
        delete user.password
      },
    }),
  },
)

const userModel = mongoose.model("User", userSchema)

export default userModel
