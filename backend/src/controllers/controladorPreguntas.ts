import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Pregunta from "../models/Pregunta";

export const obtenerPreguntasActivas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const preguntas = await Pregunta.find({ activa: true }).sort({ orden: 1 });
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener preguntas" });
  }
};

export const obtenerTodasLasPreguntas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const preguntas = await Pregunta.find().sort({ orden: 1 });
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener preguntas" });
  }
};

export const crearPregunta = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }

  try {
    const { texto, orden } = req.body;
    const nuevaPregunta = new Pregunta({ texto, orden });
    await nuevaPregunta.save();
    res.status(201).json(nuevaPregunta);
  } catch (error) {
    res.status(500).json({ error: "Error al crear pregunta" });
  }
};

export const actualizarPregunta = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }

  try {
    const { id } = req.params;
    const { texto, orden, activa } = req.body;

    const pregunta = await Pregunta.findByIdAndUpdate(
      id,
      { texto, orden, activa },
      { new: true, runValidators: true }
    );

    if (!pregunta) {
      res.status(404).json({ error: "Pregunta no encontrada" });
      return;
    }

    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar pregunta" });
  }
};

export const eliminarPregunta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const pregunta = await Pregunta.findByIdAndDelete(id);

    if (!pregunta) {
      res.status(404).json({ error: "Pregunta no encontrada" });
      return;
    }

    res.json({ mensaje: "Pregunta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar pregunta" });
  }
};