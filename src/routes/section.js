import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import sectionController from "../controllers/section"
import sectionValidation from "../validations/section"

const sectionRoute = {
  path: "/places/:placeId/sections",
  configureRouter: (router) => {
    router.post(
      "/",
      authMiddleware(),
      validate(sectionValidation.getSectionsForPlace),
      sectionController.getSectionsForPlace,
    )
  },
}

export default sectionRoute
