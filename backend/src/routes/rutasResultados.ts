import { Router } from "express";
import { body } from "express-validator";
import {
  enviarTest,
  obtenerMisResultados,
  obtenerResultadosUsuariosAdmin,
} from "../controllers/controladorResultados";
import {
  requiereAdmin,
  requiereAutenticacion,
} from "../middleware/autenticacion";

const enrutador = Router();

enrutador.post(
  "/",
  requiereAutenticacion,
  [
    body("respuestas")
      .isArray({ min: 1 })
      .withMessage("Las respuestas son requeridas"),
    body("respuestas.*.preguntaId")
      .notEmpty()
      .withMessage("preguntaId requerido"),
    body("respuestas.*.valor")
      .isInt({ min: 1, max: 5 })
      .withMessage("El valor debe estar entre 1 y 5"),
  ],
  enviarTest
);

enrutador.get("/mis-resultados", requiereAutenticacion, obtenerMisResultados);
enrutador.get(
  "/admin/usuarios",
  requiereAutenticacion,
  requiereAdmin,
  obtenerResultadosUsuariosAdmin
);

export default enrutador;
