import qs from "qs"
import HttpStatus from "http-status-codes"
import fetch from "node-fetch"
import jwt from "jsonwebtoken"

import envUtils, { env } from "../utils/env"
import HttpError from "../errors/http"

const doRequest = async ({ method, url, params, data }) => {
  if (params !== undefined) {
    url += `?${qs.stringify(params)}`
  }
  const options = {
    method: (method ?? "get").toUpperCase(),
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    ...(data && { body: JSON.stringify(data) }),
  }
  const response = await fetch(url, options)
  let json = null
  if (response.headers.get("Content-Type") === "application/json") {
    json = await response.json()
  } else {
    const text = await response.text()
    if (text) {
      json = JSON.parse(text.replace(/^\(|\)$/g, ""))
    }
  }
  if (json === undefined) {
    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Internal server error",
    )
  }
  if (!response.ok) {
    throw new HttpError(json.status, json.message)
  }
  return json
}

const doRequestWrapper = async (...args) => {
  return await doRequest(...args)
}

const getLoggedUserId = (req) => {
  const token = req?.headers?.authorization
  if (!token) {
    throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthenticated")
  }
  const secret = envUtils.get(env.JwtSecret)
  const verificationResponse = jwt.verify(token, secret)
  const userId = verificationResponse._id
  return userId
}

const requestUtils = {
  get: async (url, params) => {
    return doRequestWrapper({ method: "get", url, params })
  },
  post: async (url, data) => {
    return doRequestWrapper({ method: "post", url, data })
  },
  put: async (url, data, params) => {
    return doRequestWrapper({ method: "put", url, params, data })
  },
  delete: async (url, params) => {
    return doRequestWrapper({ method: "delete", url, params })
  },
  getLoggedUserId,
}

export default requestUtils
