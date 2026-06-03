import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Resultado from "../models/Resultado";
import Pregunta from "../models/Pregunta";
import { calcularDiagnostico } from "../lib/puntuacion";

export const enviarTest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }

  try {
    const carga = (req as any).auth?.payload;
    const usuarioId = carga?.sub;
    const nombreUsuario =
      carga?.["https://minddetox.com/name"] ||
      carga?.name ||
      carga?.nickname ||
      "";
    const correoUsuario =
      carga?.["https://minddetox.com/email"] ||
      carga?.email ||
      "sin-correo";

    const { respuestas } = req.body;

    const idPreguntas = respuestas.map((r: any) => r.preguntaId);
    const preguntasEncontradas = await Pregunta.find({
      _id: { $in: idPreguntas },
    });

    const mapPreguntas = new Map(
      preguntasEncontradas.map((p) => [p._id.toString(), p.texto])
    );

    const respuestasCompletas = respuestas.map((r: any) => ({
      preguntaId: r.preguntaId,
      textoPregunta: mapPreguntas.get(r.preguntaId) || "",
      valor: r.valor,
    }));

    const puntajeTotal = respuestasCompletas.reduce(
      (suma: number, r: any) => suma + r.valor,
      0
    );

    const { diagnostico, recomendacion } = calcularDiagnostico(puntajeTotal);

    const nuevoResultado = new Resultado({
      usuarioId,
      nombreUsuario,
      correoUsuario,
      respuestas: respuestasCompletas,
      puntajeTotal,
      diagnostico,
      recomendacion,
    });

    await nuevoResultado.save();
    res.status(201).json(nuevoResultado);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar resultado" });
  }
};

export const obtenerMisResultados = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = (req as any).auth?.payload?.sub;
    const resultados = await Resultado.find({ usuarioId }).sort({
      creadoEn: -1,
    });
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener resultados" });
  }
};

export const obtenerResultadosUsuariosAdmin = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const resultados = await Resultado.find()
      .sort({ creadoEn: -1 })
      .select(
        "usuarioId nombreUsuario correoUsuario puntajeTotal diagnostico recomendacion respuestas creadoEn"
      )
      .lean();

    const usuariosMap = new Map<string, any>();

    resultados.forEach((resultado) => {
      const llaveUsuario = resultado.usuarioId || resultado.correoUsuario;
      const usuarioExistente = usuariosMap.get(llaveUsuario);

      if (usuarioExistente) {
        usuarioExistente.resultados.push(resultado);
        usuarioExistente.totalTests += 1;
        usuarioExistente.promedioPuntaje = Number(
          (
            (usuarioExistente.promedioPuntaje * (usuarioExistente.totalTests - 1) +
              resultado.puntajeTotal) /
            usuarioExistente.totalTests
          ).toFixed(1)
        );
        return;
      }

      usuariosMap.set(llaveUsuario, {
        usuarioId: resultado.usuarioId,
        nombreUsuario: resultado.nombreUsuario || "",
        correoUsuario: resultado.correoUsuario,
        totalTests: 1,
        promedioPuntaje: resultado.puntajeTotal,
        ultimoResultado: resultado,
        resultados: [resultado],
      });
    });

    res.json(Array.from(usuariosMap.values()));
  } catch (error) {
    res.status(500).json({ error: "Error al obtener resultados de usuarios" });
  }
};
