import mongoose from "mongoose";
import dotenv from "dotenv";
import Pregunta from "./models/Pregunta";

dotenv.config();

const uriMongo = process.env.MONGODB_URI || process.env.DB_CONNECTION_STRING;

const PREGUNTAS_BSMAS = [
  "Con que frecuencia piensas en las redes sociales cuando no las estas usando?",
  "Con que frecuencia sientes la necesidad de usar mas tiempo las redes sociales?",
  "Con que frecuencia usas las redes sociales para olvidar problemas personales?",
  "Con que frecuencia intentas sin exito reducir tu uso de redes sociales?",
  "Con que frecuencia te sientes ansioso o incomodo si no puedes usar las redes sociales?",
  "Con que frecuencia el uso de las redes sociales ha afectado negativamente tu vida personal, trabajo o estudios?",
  "Con que frecuencia revisas redes sociales apenas despiertas o justo antes de dormir?",
  "Con que frecuencia interrumpes tareas importantes para revisar notificaciones o publicaciones?",
  "Con que frecuencia dejas de lado descanso, convivencia o actividades personales por estar en redes?",
  "Con que frecuencia comparas tu vida con lo que ves en redes y eso afecta tu estado de animo?",
];

async function sembrar() {
  if (!uriMongo) {
    throw new Error(
      "Falta la variable de entorno MONGODB_URI o DB_CONNECTION_STRING"
    );
  }

  await mongoose.connect(uriMongo);
  await Pregunta.deleteMany({});

  const preguntas = PREGUNTAS_BSMAS.map((texto, indice) => ({
    texto,
    orden: indice + 1,
    activa: true,
  }));

  await Pregunta.insertMany(preguntas);
  console.log("Preguntas de MindDetox sembradas correctamente");
  process.exit(0);
}

sembrar().catch((err) => {
  console.error(err);
  process.exit(1);
});
