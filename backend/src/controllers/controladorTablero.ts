import { Request, Response } from "express";
import Resultado from "../models/Resultado";
import Pregunta from "../models/Pregunta";

export const obtenerEstadisticas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalResultados = await Resultado.countDocuments();
    const totalPreguntas = await Pregunta.countDocuments({ activa: true });

    const conteoDiagnosticos = await Resultado.aggregate([
      { $group: { _id: "$diagnostico", cantidad: { $sum: 1 } } },
    ]);

    const promedioPuntaje = await Resultado.aggregate([
      { $group: { _id: null, promedio: { $avg: "$puntajeTotal" } } },
    ]);

    const ultimosResultados = await Resultado.find()
      .sort({ creadoEn: -1 })
      .limit(5)
      .select("correoUsuario puntajeTotal diagnostico creadoEn");

    res.json({
      totalResultados,
      totalPreguntas,
      conteoDiagnosticos,
      promedioPuntaje: promedioPuntaje[0]?.promedio?.toFixed(1) || 0,
      ultimosResultados,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};