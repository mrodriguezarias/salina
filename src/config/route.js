import path from "path"
import { Router } from "express"
import authRoute from "../routes/auth"
import placeRoute from "../routes/place"
import categoryRoute from "../routes/category"
import sectionRoute from "../routes/section"

const routeConfig = {
  routes: [authRoute, placeRoute, categoryRoute, sectionRoute],
  configure: (app) => {
    const apiRouter = new Router()
    for (const { path, configureRouter } of routeConfig.routes) {
      const router = new Router({ mergeParams: true })
      configureRouter(router)
      apiRouter.use(path, router)
    }
    app.use(apiRouter)
    const staticRouter = new Router()
    const htmlFile = path.join(__dirname, "../../assets/index.html")
    staticRouter.all("*", (req, res) => {
      res.sendFile(htmlFile)
    })
    app.use(staticRouter)
  },
}

export default routeConfig
