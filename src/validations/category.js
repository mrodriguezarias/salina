import { Joi } from "express-validation"

const categoryNames = [
  "Bar",
  "Cafetería",
  "Comida rápida",
  "Heladería",
  "Restorán",
  "Biblioteca",
  "Escuela",
  "Universidad",
  "Banco",
  "Hospital",
  "Cine",
  "Gimnasio",
  "Jardín",
  "Parque",
  "Estación",
  "Tienda de conveniencia",
  "Compras",
  "Centro comercial",
  "Supermercado",
  "Estación de servicio",
]

const categoryValidation = {
  getImage: {
    params: Joi.object({
      name: Joi.string().valid(...categoryNames),
    }),
  },
}

export default categoryValidation
