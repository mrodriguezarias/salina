import HttpStatus from "http-status-codes"
import _ from "lodash"
import HttpError from "../errors/http"
import userModel from "../models/user"
import requestUtils from "../utils/request"
import generalUtils from "../utils/general"

const getUserIdFromPath = async (req, path) => {
  if (!path) {
    return null
  }
  const [type, ...rel] = path.split(".")
  let obj
  if (type === "req") {
    obj = req
  } else {
    const model = require(`../models/${type}`).default
    obj = await model.findById(req.params.id)
    if (!obj) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        `${generalUtils.capitalize(type)} not found`,
      )
    }
  }
  return String(_.get(obj, rel))
}

const authMiddleware = ({ admin = false, loggedId = null } = {}) => {
  return async (req, res, next) => {
    try {
      const userId = requestUtils.getLoggedUserId(req)
      const user = await userModel.findById(userId)
      if (!user) {
        throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthenticated")
      }
      const userIdFromPath = await getUserIdFromPath(req, loggedId)
      if (
        !user.admin &&
        ((admin && !user.admin) || (loggedId && userIdFromPath !== userId))
      ) {
        next(new HttpError(HttpStatus.FORBIDDEN, "Unauthorized"))
        return
      }
      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default authMiddleware
