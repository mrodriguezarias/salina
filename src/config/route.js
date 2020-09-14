import path from "path"
import { Router } from "express"
import authRoute from "../routes/auth"
import userRoute from "../routes/user"
import placeRoute from "../routes/place"

const routeConfig = {
  routes: [authRoute, userRoute, placeRoute],
  configure: (app) => {
    const apiRouter = new Router()
    for (const { path, configureRouter } of routeConfig.routes) {
      const router = new Router()
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
