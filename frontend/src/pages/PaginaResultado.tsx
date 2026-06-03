import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { obtenerMisResultados } from "../api/resultados";
import { configuracionDiagnostico } from "../lib/puntuacion";

export default function PaginaResultado() {
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  const { data: resultados, isLoading: cargando } = useQuery({
    queryKey: ["misResultados"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return obtenerMisResultados(token);
    },
  });

  if (cargando) {
    return (
      <div className="rounded-[2rem] border border-stone-200 bg-white/80 px-6 py-10 text-center text-stone-400 shadow-lg shadow-stone-200/30">
        Cargando resultado...
      </div>
    );
  }

  const resultado = resultados?.find((r) => r._id === id);

  if (!resultado) {
    return (
      <div className="space-y-3 rounded-[2rem] border border-stone-200 bg-white/80 px-6 py-10 text-center shadow-lg shadow-stone-200/30">
        <p className="text-stone-600">Resultado no encontrado</p>
        <Link to="/" className="text-sm text-teal-600">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const configuracion = configuracionDiagnostico[resultado.diagnostico];
  const puntajeMaximo = resultado.respuestas.length * 5;
  const avance =
    puntajeMaximo > 0
      ? Math.min((resultado.puntajeTotal / puntajeMaximo) * 100, 100)
      : 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div
          className={`rounded-[2rem] border p-8 shadow-lg shadow-stone-200/25 ${configuracion.fondo}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-600">
            Tu diagnostico MindDetox
          </p>
          <h1 className="mt-3 text-3xl font-black text-stone-900">
            {configuracion.etiqueta}
          </h1>
          <p className="mt-3 text-sm leading-7 text-stone-700">
            {configuracion.resumen}
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-white/80 bg-white/80 p-5">
            <p className={`text-6xl font-black ${configuracion.color}`}>
              {resultado.puntajeTotal}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              puntos de {puntajeMaximo} posibles
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-stone-900 transition-all duration-500"
                style={{ width: `${avance}%` }}
              />
            </div>
            <span
              className={`mt-4 inline-block rounded-full border bg-white px-4 py-1.5 text-sm font-semibold ${configuracion.color}`}
            >
              {resultado.diagnostico}
            </span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-200/80 bg-white/85 p-8 shadow-lg shadow-stone-200/30">
          <h2 className="text-xl font-bold text-stone-900">
            Que puedes hacer ahora
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            {resultado.recomendacion}
          </p>
          <div className="mt-6 space-y-3">
            {configuracion.medidas.map((medida) => (
              <div
                key={medida}
                className="flex gap-3 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-4"
              >
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-500" />
                <p className="text-sm leading-6 text-stone-600">{medida}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-stone-200/80 bg-white/85 p-6 shadow-lg shadow-stone-200/20">
        <h2 className="text-xl font-bold text-stone-900">Recursos de apoyo</h2>
        <p className="mt-1 text-sm text-stone-500">
          Enlaces de referencia para informarte y tomar medidas utiles.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {configuracion.recursos.map((recurso) => (
            <a
              key={recurso.url}
              href={recurso.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-white"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                {recurso.fuente}
              </p>
              <h3 className="mt-2 text-lg font-bold text-stone-900">
                {recurso.titulo}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {recurso.descripcion}
              </p>
              <p className="mt-4 text-sm font-medium text-stone-900 group-hover:text-teal-700">
                Abrir recurso
              </p>
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-stone-800">Tus respuestas</h2>
        {resultado.respuestas.map((respuesta, indice) => (
          <div
            key={indice}
            className="flex items-start justify-between gap-4 rounded-2xl border border-stone-100 bg-white/80 px-4 py-3 shadow-sm"
          >
            <p className="flex-1 text-sm text-stone-600">
              {respuesta.textoPregunta}
            </p>
            <span className="shrink-0 text-sm font-semibold text-teal-700">
              {respuesta.valor}/5
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/mis-resultados"
          className="block rounded-full border border-stone-300 bg-white py-3 text-center font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900"
        >
          Ver mi historial
        </Link>
        <Link
          to="/test"
          className="block rounded-full bg-stone-900 py-3 text-center font-medium text-white transition-colors hover:bg-stone-700"
        >
          Repetir test
        </Link>
      </div>
    </div>
  );
}
