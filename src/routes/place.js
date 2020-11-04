import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import placeController from "../controllers/place"
import placeValidation from "../validations/place"

const placeRoute = {
  path: "/places",
  configureRouter: (router) => {
    router.post(
      "/search",
      authMiddleware(),
      validate(placeValidation.searchPlaces),
      placeController.searchPlaces,
    )
    router.post(
      "/locate",
      authMiddleware(),
      validate(placeValidation.locatePlaces),
      placeController.locatePlaces,
    )
    router.post(
      "/:id",
      authMiddleware(),
      validate(placeValidation.getPlace),
      placeController.getPlaceById,
    )
    // router.post(
    //   "/",
    //   authMiddleware(),
    //   validate(placeValidation.createPlace),
    //   placeController.createPlace,
    // )
    // router.put(
    //   "/:id",
    //   authMiddleware(),
    //   validate(placeValidation.updatePlace),
    //   placeController.updatePlace,
    // )
    // router.delete(
    //   "/:id",
    //   authMiddleware(),
    //   validate(placeValidation.deletePlace),
    //   placeController.deletePlace,
    // )
  },
}

export default placeRoute
