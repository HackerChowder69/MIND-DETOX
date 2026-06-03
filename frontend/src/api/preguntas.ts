const URL_API = import.meta.env.VITE_API_URL;

const extraerMensajeError = async (respuesta: Response) => {
  try {
    const data = await respuesta.json();

    if (typeof data?.mensaje === "string") {
      return typeof data?.error === "string"
        ? `${data.error}: ${data.mensaje}`
        : data.mensaje;
    }

    if (typeof data?.error === "string") return data.error;

    if (Array.isArray(data?.errores) && data.errores.length > 0) {
      return data.errores
        .map((error: { msg?: string }) => error.msg)
        .filter(Boolean)
        .join(", ");
    }
  } catch {
    // Si la respuesta no es JSON, usamos un mensaje generico.
  }

  return `Error ${respuesta.status}: ${respuesta.statusText}`;
};

export interface Pregunta {
  _id: string;
  texto: string;
  orden: number;
  activa: boolean;
}

export const obtenerPreguntasActivas = async (): Promise<Pregunta[]> => {
  const respuesta = await fetch(`${URL_API}/preguntas/activas`);
  if (!respuesta.ok) throw new Error(await extraerMensajeError(respuesta));
  return respuesta.json();
};

export const obtenerTodasLasPreguntas = async (
  token: string
): Promise<Pregunta[]> => {
  const respuesta = await fetch(`${URL_API}/preguntas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error(await extraerMensajeError(respuesta));
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
  if (!respuesta.ok) throw new Error(await extraerMensajeError(respuesta));
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
  if (!respuesta.ok) throw new Error(await extraerMensajeError(respuesta));
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
  if (!respuesta.ok) throw new Error(await extraerMensajeError(respuesta));
};
