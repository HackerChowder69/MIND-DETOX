const URL_API = import.meta.env.VITE_API_URL;

export interface Pregunta {
  _id: string;
  texto: string;
  orden: number;
  activa: boolean;
}

export const obtenerPreguntasActivas = async (): Promise<Pregunta[]> => {
  const respuesta = await fetch(`${URL_API}/preguntas/activas`);
  if (!respuesta.ok) throw new Error("Error al cargar preguntas");
  return respuesta.json();
};

export const obtenerTodasLasPreguntas = async (
  token: string
): Promise<Pregunta[]> => {
  const respuesta = await fetch(`${URL_API}/preguntas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error("Error al cargar preguntas");
  return respuesta.json();
};

export const crearPregunta = async (
  token: string,
  datos: { texto: string; orden: number }
): Promise<Pregunta> => {
  const respuesta = await fetch(`${URL_API}/preguntas`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });
  if (!respuesta.ok) throw new Error("Error al crear pregunta");
  return respuesta.json();
};

export const actualizarPregunta = async (
  token: string,
  id: string,
  datos: { texto: string; orden: number; activa: boolean }
): Promise<Pregunta> => {
  const respuesta = await fetch(`${URL_API}/preguntas/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });
  if (!respuesta.ok) throw new Error("Error al actualizar pregunta");
  return respuesta.json();
};

export const eliminarPregunta = async (
  token: string,
  id: string
): Promise<void> => {
  const respuesta = await fetch(`${URL_API}/preguntas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error("Error al eliminar pregunta");
};