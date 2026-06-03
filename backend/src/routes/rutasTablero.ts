import { Router } from "express";
import { obtenerEstadisticas } from "../controllers/controladorTablero";
import {
  requiereAutenticacion,
  requiereAdmin,
} from "../middleware/autenticacion";

const enrutador = Router();

enrutador.get(
  "/estadisticas",
  requiereAutenticacion,
  requiereAdmin,
  obtenerEstadisticas
);

export default enrutador;