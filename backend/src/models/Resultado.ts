import mongoose, { Schema, Document } from "mongoose";

export type NivelDiagnostico = "Bajo" | "Moderado" | "Alto";

export interface IRespuesta {
  preguntaId: mongoose.Types.ObjectId;
  textoPregunta: string;
  valor: number;
}

export interface IResultado extends Document {
  usuarioId: string;
  nombreUsuario?: string;
  correoUsuario: string;
  respuestas: IRespuesta[];
  puntajeTotal: number;
  diagnostico: NivelDiagnostico;
  recomendacion: string;
  creadoEn: Date;
}

const EsquemaRespuesta = new Schema<IRespuesta>({
  preguntaId: {
    type: Schema.Types.ObjectId,
    ref: "Pregunta",
    required: true,
  },
  textoPregunta: {
    type: String,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

const EsquemaResultado = new Schema<IResultado>(
  {
    usuarioId: { type: String, required: true },
    nombreUsuario: { type: String, trim: true },
    correoUsuario: { type: String, required: true },
    respuestas: { type: [EsquemaRespuesta], required: true },
    puntajeTotal: { type: Number, required: true },
    diagnostico: {
      type: String,
      enum: ["Bajo", "Moderado", "Alto"],
      required: true,
    },
    recomendacion: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "creadoEn" },
  }
);

export default mongoose.model<IResultado>("Resultado", EsquemaResultado);
