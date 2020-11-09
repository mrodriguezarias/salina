import fs from "fs"
import _ from "lodash"
import dbUtils from "../src/utils/db"
import placeService from "../src/services/place"
import consoleUtils from "../src/utils/console"

const categories = [
  {
    key: "bar",
    name: "Bar",
    sections: ["Mesas", "Barra", "Terraza"],
  },
  {
    key: "cafe",
    name: "Cafetería",
    sections: ["Sector no fumador", "Sector fumador"],
  },
  {
    key: "fast_food",
    name: "Comida rápida",
    sections: ["Planta baja", "Primer piso", "Mesas de afuera"],
  },
  { key: "ice_cream", name: "Heladería", sections: ["default"] },
  {
    key: "restaurant",
    name: "Restorán",
    sections: ["Interior", "Exterior"],
  },
  {
    key: "library",
    name: "Biblioteca",
    sections: ["Planta baja", "Primer piso", "Segundo piso"],
  },
  {
    key: "school",
    name: "Escuela",
    sections: ["Jardín", "Primaria", "Secundaria"],
  },
  {
    key: "university",
    name: "Universidad",
    sections: ["Pabellón 1", "Pabellón 2", "Pabellón 3"],
  },
  {
    key: "bank",
    name: "Banco",
    sections: [
      "Depósitos y extracciones",
      "Préstamos",
      "Tarjetas de crédito",
      "Cajas de ahorro",
    ],
  },
  {
    key: "hospital",
    name: "Hospital",
    sections: [
      "Consultorio 1",
      "Consultorio 2",
      "Consultorio 3",
      "Consultorio 4",
    ],
  },
  {
    key: "cinema",
    name: "Cine",
    sections: ["Sala 1", "Sala 2", "Sala 3", "Sala 4", "Sala 5"],
  },
  { key: "fitness_centre", name: "Gimnasio", sections: ["default"] },
  { key: "garden", name: "Jardín", sections: ["default"] },
  { key: "park", name: "Parque", sections: ["default"] },
  { key: "station", name: "Estación", sections: ["default"] },
  {
    key: "convenience",
    name: "Tienda de conveniencia",
    sections: ["default"],
  },
  { key: "department_store", name: "Compras", sections: ["default"] },
  {
    key: "mall",
    name: "Centro comercial",
    sections: [
      "Negocios planta baja",
      "Negocios primer piso",
      "Cines",
      "Patio de comidas",
      "Zona de juegos",
    ],
  },
  { key: "supermarket", name: "Supermercado", sections: ["default"] },
  {
    key: "fuel",
    name: "Estación de servicio",
    sections: ["Surtidores", "Tienda"],
  },
]

const uploadPlaces = {
  name: "upload_places",
  run: async (args) => {
    const path = uploadPlaces.parseArgs(args)
    const places = uploadPlaces.parseFile(path)
    await uploadPlaces.uploadToDatabase(places)
  },
  parseArgs: (args) => {
    const path = args._?.[1] ?? "./data/places.json"
    if (!fs.existsSync(path)) {
      throw Error(`file '${path}' does not exist`)
    }
    return path
  },
  parseFile: (path) => {
    console.info("Parsing file…")
    const data = fs.readFileSync(path)
    return JSON.parse(data)
  },
  uploadToDatabase: async (places) => {
    await dbUtils.connect(true)
    try {
      console.info("Deleting preexisting places…")
      await placeService.deleteAllPlaces()
      for (const [index, place] of places.entries()) {
        consoleUtils.printProgress("Adding place", index + 1, places.length)
        const category = categories.find(({ key }) => key === place.category)
        const location = {
          longitude: place.coords.longitude,
          latitude: place.coords.latitude,
        }
        const sections = category.sections.map((name) => ({
          name,
          capacity: _.random(2, 8) * 10,
        }))
        const data = {
          name: place.name,
          category: category.name,
          location,
          sections,
        }
        await placeService.createPlace(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      dbUtils.disconnect()
    }
  },
}

export default uploadPlaces
