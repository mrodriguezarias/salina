import userController from "../controllers/user"
import authMiddleware from "../middlewares/auth"
import { validate } from "express-validation"
import userValidation from "../validations/user"

const userRoute = {
  path: "/users",
  configureRouter: (router) => {
    router.get("/", authMiddleware(), userController.getUsers)
    router.get(
      "/:id",
      authMiddleware(),
      validate(userValidation.getUser),
      userController.getUserById,
    )
    router.post(
      "/",
      authMiddleware(),
      validate(userValidation.createUser),
      userController.createUser,
    )
    router.put(
      "/:id",
      authMiddleware(),
      validate(userValidation.updateUser),
      userController.updateUser,
    )
    router.delete(
      "/:id",
      authMiddleware(),
      validate(userValidation.deleteUser),
      userController.deleteUser,
    )
  },
}

export default userRoute
