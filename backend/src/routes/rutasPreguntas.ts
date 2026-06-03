import { Router } from "express";
import { body } from "express-validator";
import {
  obtenerPreguntasActivas,
  obtenerTodasLasPreguntas,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
} from "../controllers/controladorPreguntas";
import {
  requiereAutenticacion,
  requiereAdmin,
} from "../middleware/autenticacion";

const enrutador = Router();

const validacionPregunta = [
  body("texto")
    .notEmpty()
    .withMessage("El texto de la pregunta es requerido"),
  body("orden").isNumeric().withMessage("El orden debe ser un número"),
];

enrutador.get("/activas", obtenerPreguntasActivas);

enrutador.get(
  "/",
  requiereAutenticacion,
  requiereAdmin,
  obtenerTodasLasPreguntas
);
enrutador.post(
  "/",
  requiereAutenticacion,
  requiereAdmin,
  validacionPregunta,
  crearPregunta
);
enrutador.put(
  "/:id",
  requiereAutenticacion,
  requiereAdmin,
  validacionPregunta,
  actualizarPregunta
);
enrutador.delete(
  "/:id",
  requiereAutenticacion,
  requiereAdmin,
  eliminarPregunta
);

export default enrutador;