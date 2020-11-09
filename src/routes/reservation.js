import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import reservationController from "../controllers/reservation"
import reservationValidation from "../validations/reservation"

const reservationRoute = {
  path: "/reservations",
  configureRouter: (router) => {
    router.post(
      "/",
      authMiddleware(),
      validate(reservationValidation.getReservations),
      reservationController.getReservations,
    )
    router.post(
      "/add",
      authMiddleware(),
      validate(reservationValidation.addReservation),
      reservationController.addReservation,
    )
    router.post(
      "/dates",
      authMiddleware(),
      validate(reservationValidation.getDates),
      reservationController.getDates,
    )
    router.post(
      "/times",
      authMiddleware(),
      validate(reservationValidation.getTimes),
      reservationController.getTimes,
    )
    router.post(
      "/:id",
      authMiddleware({ loggedId: "reservation.user" }),
      validate(reservationValidation.getReservation),
      reservationController.getReservation,
    )
    router.post(
      "/:id/remove",
      authMiddleware({ loggedId: "reservation.user" }),
      validate(reservationValidation.removeReservation),
      reservationController.removeReservation,
    )
  },
}

export default reservationRoute
