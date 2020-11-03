import { validate } from "express-validation"

import categoryController from "../controllers/category"
import categoryValidation from "../validations/category"

const categoryRoute = {
  path: "/categories",
  configureRouter: (router) => {
    router.get(
      "/:name/image",
      validate(categoryValidation.getImage),
      categoryController.getImage,
    )
  },
}

export default categoryRoute
