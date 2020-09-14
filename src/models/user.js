import { Schema, model } from "mongoose"
import dbUtils from "../utils/db"

const userSchema = new Schema(
  {
    name: { type: String, index: { unique: true } },
    password: String,
  },
  {
    toJSON: dbUtils.toJSON({
      next: (user) => {
        delete user.password
      },
    }),
  },
)

const userModel = model("User", userSchema)

export default userModel
