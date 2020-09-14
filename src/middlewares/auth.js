import jwt from "jsonwebtoken"
import HttpStatus from "http-status-codes"
import HttpError from "../errors/http"
import userModel from "../models/user"
import envUtils, { env } from "../utils/env"
import _ from "lodash"

const authMiddleware = () => {
  return async (req, res, next) => {
    const token = req.headers.authorization
    const secret = envUtils.get(env.JwtSecret)
    try {
      if (!token) {
        throw new Error()
      }
      const verificationResponse = jwt.verify(token, secret)
      const userId = verificationResponse._id
      const user = await userModel.findById(userId)
      if (!user) {
        throw new Error()
      }
      req.user = user
      next()
    } catch (error) {
      next(new HttpError(HttpStatus.UNAUTHORIZED, "Unauthenticated"))
    }
  }
}

export default authMiddleware
