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
    // Si la respuesta no es JSON, usamos un mensaje genérico.
  }

  return `Error ${respuesta.status}: ${respuesta.statusText}`;
};

export interface RespuestaEnviada {
  preguntaId: string;
  valor: number;
}

export interface Resultado {
  _id: string;
  puntajeTotal: number;
  diagnostico: "Bajo" | "Moderado" | "Alto";
  recomendacion: string;
  respuestas: {
    preguntaId: string;
    textoPregunta: string;
    valor: number;
  }[];
  creadoEn: string;
}

export interface UsuarioConResultados {
  usuarioId: string;
  nombreUsuario?: string;
  correoUsuario: string;
  totalTests: number;
  promedioPuntaje: number;
  ultimoResultado: Resultado;
  resultados: Resultado[];
}

export const enviarTest = async (
  token: string,
  respuestas: RespuestaEnviada[]
): Promise<Resultado> => {
  const respuesta = await fetch(`${URL_API}/resultados`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ respuestas }),
  });

  if (!respuesta.ok) {
    throw new Error(await extraerMensajeError(respuesta));
  }

  return respuesta.json();
};

export const obtenerMisResultados = async (
  token: string
): Promise<Resultado[]> => {
  const respuesta = await fetch(`${URL_API}/resultados/mis-resultados`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!respuesta.ok) {
    throw new Error(await extraerMensajeError(respuesta));
  }

  return respuesta.json();
};

export const obtenerEstadisticasTablero = async (token: string) => {
  const respuesta = await fetch(`${URL_API}/tablero/estadisticas`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!respuesta.ok) {
    throw new Error(await extraerMensajeError(respuesta));
  }

  return respuesta.json();
};

export const obtenerUsuariosConResultados = async (
  token: string
): Promise<UsuarioConResultados[]> => {
  const respuesta = await fetch(`${URL_API}/resultados/admin/usuarios`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!respuesta.ok) {
    throw new Error(await extraerMensajeError(respuesta));
  }

  return respuesta.json();
};
