import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import { obtenerPreguntasActivas } from "../api/preguntas";
import { enviarTest } from "../api/resultados";
import { OPCIONES_ESCALA } from "../lib/puntuacion";
import { guardarRutaPostLogin, obtenerTokenApi } from "../lib/autenticacion";

export default function PaginaTest() {
  const { getAccessTokenSilently, loginWithRedirect, isAuthenticated, user } =
    useAuth0();
  const navegar = useNavigate();
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const rutaActual = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  const {
    data: preguntas,
    isLoading: cargando,
    isError: errorCargandoPreguntas,
  } = useQuery({
    queryKey: ["preguntasActivas"],
    queryFn: obtenerPreguntasActivas,
  });

  const mutacionEnvio = useMutation({
    mutationFn: async () => {
      const token = await obtenerTokenApi(getAccessTokenSilently);
      const respuestasFormateadas = Object.entries(respuestas).map(
        ([preguntaId, valor]) => ({ preguntaId, valor })
      );
      return enviarTest(token, respuestasFormateadas, {
        correo: user?.email,
        nombre: user?.name || user?.nickname,
      });
    },
    onSuccess: (resultado) => {
      toast.success("Test completado");
      navegar(`/resultado/${resultado._id}`);
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Error al guardar el test"
      ),
  });

  const seleccionarRespuesta = (preguntaId: string, valor: number) => {
    setRespuestas((anterior) => ({ ...anterior, [preguntaId]: valor }));
  };

  const manejarEnvio = () => {
    const totalPreguntas = preguntas?.length || 0;
    const totalRespondidas = Object.keys(respuestas).length;

    if (totalRespondidas < totalPreguntas) {
      toast.error("Responde todas las preguntas antes de continuar");
      return;
    }

    mutacionEnvio.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-4 rounded-[2rem] border border-stone-200 bg-white/80 px-6 py-10 text-center shadow-lg shadow-stone-200/30">
        <p className="text-stone-600">
          Necesitas iniciar sesion para realizar el test.
        </p>
        <button
          onClick={() => {
            guardarRutaPostLogin(rutaActual);
            loginWithRedirect({ appState: { returnTo: rutaActual } });
          }}
          className="rounded-full bg-teal-700 px-6 py-2.5 text-white"
        >
          Iniciar sesion
        </button>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="rounded-[2rem] border border-stone-200 bg-white/80 px-6 py-10 text-center text-stone-400 shadow-lg shadow-stone-200/30">
        Cargando test...
      </div>
    );
  }

  if (errorCargandoPreguntas) {
    return (
      <div className="space-y-3 rounded-[2rem] border border-rose-200 bg-white/85 px-6 py-10 text-center shadow-lg shadow-stone-200/30">
        <p className="font-medium text-stone-700">
          No se pudieron cargar las preguntas del test
        </p>
        <p className="text-sm text-stone-500">
          Revisa que el backend este corriendo y que `VITE_API_URL` apunte a la
          API correcta.
        </p>
      </div>
    );
  }

  const totalPreguntas = preguntas?.length || 0;
  const totalRespondidas = Object.keys(respuestas).length;
  const progreso =
    totalPreguntas > 0 ? (totalRespondidas / totalPreguntas) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-7 shadow-lg shadow-stone-200/30">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
            Test MindDetox
          </p>
          <h1 className="mt-3 text-3xl font-black text-stone-900">
            Evalua tu relacion con las redes sociales
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Responde con que frecuencia aplica cada situacion durante el ultimo
            mes. El objetivo es ayudarte a detectar patrones, no juzgarte.
          </p>
        </div>

        <div className="rounded-[2rem] border border-stone-200/80 bg-stone-900 p-6 text-white shadow-xl shadow-stone-900/15">
          <p className="text-xs uppercase tracking-[0.25em] text-teal-300">
            Progreso
          </p>
          <p className="mt-3 text-4xl font-black">{Math.round(progreso)}%</p>
          <p className="mt-1 text-sm text-stone-300">
            {totalRespondidas} de {totalPreguntas} preguntas respondidas
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-teal-400 transition-all duration-500"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {preguntas?.map((pregunta, indice) => (
          <div
            key={pregunta._id}
            className="space-y-4 rounded-[1.75rem] border border-stone-200/80 bg-white/85 p-6 shadow-lg shadow-stone-200/20"
          >
            <p className="font-medium leading-7 text-stone-800">
              <span className="mr-2 text-sm font-semibold text-teal-600">
                {indice + 1}.
              </span>
              {pregunta.texto}
            </p>
            <div className="flex flex-wrap gap-2">
              {OPCIONES_ESCALA.map((opcion) => (
                <button
                  key={opcion.valor}
                  onClick={() =>
                    seleccionarRespuesta(pregunta._id, opcion.valor)
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    respuestas[pregunta._id] === opcion.valor
                      ? "border-teal-700 bg-teal-700 text-white shadow-md shadow-teal-700/20"
                      : "border-stone-200 text-stone-600 hover:border-teal-300 hover:bg-teal-50"
                  }`}
                >
                  {opcion.etiqueta}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalPreguntas === 0 && (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          No hay preguntas activas disponibles todavia. Agrega o activa
          preguntas desde el panel de administracion.
        </div>
      )}

      <button
        onClick={manejarEnvio}
        disabled={mutacionEnvio.isPending || totalPreguntas === 0}
        className="w-full rounded-full bg-stone-900 py-3.5 font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
      >
        {mutacionEnvio.isPending ? "Guardando..." : "Ver mi diagnostico"}
      </button>
    </div>
  );
}
