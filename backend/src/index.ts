import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rutasPreguntas from "./routes/rutasPreguntas";
import rutasResultados from "./routes/rutasResultados";
import rutasTablero from "./routes/rutasTablero";
import { manejarErrorAutenticacion } from "./middleware/autenticacion";

dotenv.config();

const aplicacion = express();
const puerto = process.env.PORT || 5000;
const uriMongo = process.env.MONGODB_URI || process.env.DB_CONNECTION_STRING;
const normalizarOrigen = (origen: string) => origen.trim().replace(/\/$/, "");

const origenesPermitidos = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map(normalizarOrigen)
    .filter(Boolean),
];

aplicacion.use(
  cors({ origin: origenesPermitidos, credentials: true })
);
aplicacion.use(express.json());

aplicacion.use("/api/preguntas", rutasPreguntas);
aplicacion.use("/api/resultados", rutasResultados);
aplicacion.use("/api/tablero", rutasTablero);
aplicacion.use(manejarErrorAutenticacion);

mongoose
  .connect(
    (() => {
      if (!uriMongo) {
        throw new Error(
          "Falta la variable de entorno MONGODB_URI o DB_CONNECTION_STRING"
        );
      }
      return uriMongo;
    })()
  )
  .then(() => {
    console.log("Conectado a MongoDB");
    aplicacion.listen(puerto, () =>
      console.log(`MindDetox backend corriendo en puerto ${puerto}`)
    );
  })
  .catch((err) => console.error("Error MongoDB:", err));
