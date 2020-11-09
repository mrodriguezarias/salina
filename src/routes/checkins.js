import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import checkinController from "../controllers/checkin"
import checkinValidation from "../validations/checkin"

const checkinRoute = {
  path: "/checkins",
  configureRouter: (router) => {
    router.post("/", authMiddleware(), checkinController.getCheckins)
    router.post(
      "/add",
      authMiddleware(),
      validate(checkinValidation.addCheckin),
      checkinController.addCheckin,
    )
    router.post("/remove", authMiddleware(), checkinController.removeCheckin)
    router.post(
      "/:id",
      authMiddleware({ loggedId: "checkin.user" }),
      validate(checkinValidation.getCheckin),
      checkinController.getCheckin,
    )
  },
}

export default checkinRoute
