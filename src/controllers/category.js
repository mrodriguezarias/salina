import HttpStatus from "http-status-codes"
import path from "path"

const categoryController = {
  getImage: async (req, res, next) => {
    try {
      const { name } = req.params
      const file = path.join(__dirname, `../../assets/cats/${name}.png`)
      res.sendFile(file)
    } catch (error) {
      next(error)
    }
  },
}

export default categoryController
