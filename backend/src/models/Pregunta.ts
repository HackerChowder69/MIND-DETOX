import mongoose, { Schema, Document } from "mongoose";

export interface IPregunta extends Document {
  texto: string;
  orden: number;
  activa: boolean;
  creadaEn: Date;
  actualizadaEn: Date;
}

const EsquemaPregunta = new Schema<IPregunta>(
  {
    texto: {
      type: String,
      required: true,
      trim: true,
    },
    orden: {
      type: Number,
      required: true,
      default: 0,
    },
    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "creadaEn",
      updatedAt: "actualizadaEn",
    },
  }
);

export default mongoose.model<IPregunta>("Pregunta", EsquemaPregunta);