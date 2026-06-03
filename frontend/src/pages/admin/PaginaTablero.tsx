import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { obtenerEstadisticasTablero } from "../../api/resultados";
import { configuracionDiagnostico } from "../../lib/puntuacion";
import type { NivelDiagnostico } from "../../lib/puntuacion";
import { obtenerTokenApi } from "../../lib/autenticacion";

export default function PaginaTablero() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const {
    data: estadisticas,
    isLoading: cargando,
    isError,
    error,
  } = useQuery({
    queryKey: ["estadisticasTablero"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const token = await obtenerTokenApi(getAccessTokenSilently);
      return obtenerEstadisticasTablero(token);
    },
  });

  if (cargando) {
    return <p className="text-stone-400 text-sm">Cargando estadisticas...</p>;
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-xl border border-rose-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-stone-900">Tablero</h1>
        <p className="font-medium text-stone-700">
          No se pudieron cargar las estadisticas.
        </p>
        <p className="text-sm text-stone-500">
          {error instanceof Error
            ? error.message
            : "Ocurrio un error al consultar el backend."}
        </p>
        <p className="text-sm text-stone-500">
          Si el mensaje es `Acceso denegado`, inicia sesion con la cuenta
          configurada como administradora en el backend.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Tablero</h1>
        <p className="text-sm text-stone-500 mt-1">
          Resumen general de MindDetox
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { etiqueta: "Tests realizados", valor: estadisticas?.totalResultados },
          { etiqueta: "Preguntas activas", valor: estadisticas?.totalPreguntas },
          { etiqueta: "Puntaje promedio", valor: estadisticas?.promedioPuntaje },
        ].map((metrica) => (
          <div
            key={metrica.etiqueta}
            className="bg-white border border-stone-200 rounded-xl p-5"
          >
            <p className="text-2xl font-bold text-stone-900">
              {metrica.valor ?? "-"}
            </p>
            <p className="text-xs text-stone-500 mt-1">{metrica.etiqueta}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h2 className="font-semibold text-stone-800 mb-4">
          Distribucion de diagnosticos
        </h2>
        <div className="space-y-3">
          {estadisticas?.conteoDiagnosticos?.length === 0 && (
            <p className="text-sm text-stone-500">
              Aun no hay resultados registrados para mostrar esta distribucion.
            </p>
          )}
          {estadisticas?.conteoDiagnosticos?.map(
            (elemento: { _id: NivelDiagnostico; cantidad: number }) => {
              const configuracion = configuracionDiagnostico[elemento._id];
              const porcentaje = estadisticas.totalResultados
                ? Math.round(
                    (elemento.cantidad / estadisticas.totalResultados) * 100
                  )
                : 0;

              return (
                <div key={elemento._id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={`font-medium ${configuracion.color}`}>
                      {elemento._id}
                    </span>
                    <span className="text-stone-400">
                      {elemento.cantidad} ({porcentaje}%)
                    </span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        elemento._id === "Alto"
                          ? "bg-rose-400"
                          : elemento._id === "Moderado"
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Ultimos tests</h2>
        <div className="space-y-2">
          {estadisticas?.ultimosResultados?.length === 0 && (
            <p className="text-sm text-stone-500">
              Todavia no se han guardado tests.
            </p>
          )}
          {estadisticas?.ultimosResultados?.map(
            (resultado: {
              _id: string;
              correoUsuario: string;
              puntajeTotal: number;
              diagnostico: NivelDiagnostico;
              creadoEn: string;
            }) => {
              const configuracion =
                configuracionDiagnostico[resultado.diagnostico];

              return (
                <div
                  key={resultado._id}
                  className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
                >
                  <span className="text-sm text-stone-600">
                    {resultado.correoUsuario}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-800">
                      {resultado.puntajeTotal} pts
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${configuracion.fondo} ${configuracion.color}`}
                    >
                      {resultado.diagnostico}
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
