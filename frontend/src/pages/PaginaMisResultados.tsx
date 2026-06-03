import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { obtenerMisResultados } from "../api/resultados";
import { configuracionDiagnostico } from "../lib/puntuacion";
import { guardarRutaPostLogin, obtenerTokenApi } from "../lib/autenticacion";

const formatearFecha = (fecha: string) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));

export default function PaginaMisResultados() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, user } =
    useAuth0();
  const rutaActual = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  const { data: resultados, isLoading: cargando, isError } = useQuery({
    queryKey: ["misResultados"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const token = await obtenerTokenApi(getAccessTokenSilently);
      return obtenerMisResultados(token);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="space-y-4 rounded-[2rem] border border-stone-200 bg-white/80 px-6 py-10 text-center shadow-lg shadow-stone-200/30">
        <p className="text-stone-600">
          Inicia sesion para consultar tu historial de resultados.
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
        Cargando tus resultados...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-white/85 px-6 py-10 text-center shadow-lg shadow-stone-200/30">
        <p className="font-medium text-stone-700">
          No se pudo cargar tu historial por ahora.
        </p>
      </div>
    );
  }

  const totalResultados = resultados?.length || 0;
  const ultimoResultado = resultados?.[0];

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-7 shadow-lg shadow-stone-200/30">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
            Panel personal
          </p>
          <h1 className="mt-3 text-3xl font-black text-stone-900">
            Tus resultados MindDetox
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Aqui puedes revisar tu historial de tests, identificar cambios en
            tu puntaje y volver a abrir cualquier diagnostico guardado.
          </p>
          <p className="mt-4 text-sm text-stone-500">
            Sesion activa: {user?.email}
          </p>
        </div>

        <div className="rounded-[2rem] border border-stone-200/80 bg-stone-900 p-6 text-white shadow-xl shadow-stone-900/15">
          <p className="text-xs uppercase tracking-[0.25em] text-teal-300">
            Resumen
          </p>
          <p className="mt-3 text-4xl font-black">{totalResultados}</p>
          <p className="mt-1 text-sm text-stone-300">tests registrados</p>
          <p className="mt-5 text-sm text-stone-300">
            Ultimo diagnostico:{" "}
            <span className="font-semibold text-white">
              {ultimoResultado?.diagnostico || "Sin registros"}
            </span>
          </p>
        </div>
      </section>

      {totalResultados === 0 ? (
        <section className="space-y-4 rounded-[2rem] border border-dashed border-stone-300 bg-white/70 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">
            Aun no tienes resultados guardados
          </h2>
          <p className="text-sm leading-7 text-stone-500">
            Cuando completes el test, tus diagnosticos apareceran aqui para que
            puedas consultarlos despues.
          </p>
          <Link
            to="/test"
            className="inline-flex items-center justify-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
          >
            Realizar mi primer test
          </Link>
        </section>
      ) : (
        <section className="space-y-4">
          {resultados?.map((resultado) => {
            const configuracion =
              configuracionDiagnostico[resultado.diagnostico];

            return (
              <article
                key={resultado._id}
                className="rounded-[1.75rem] border border-stone-200/80 bg-white/85 p-6 shadow-lg shadow-stone-200/20"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                      {formatearFecha(resultado.creadoEn)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-stone-900">
                        {configuracion.etiqueta}
                      </h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${configuracion.fondo} ${configuracion.color}`}
                      >
                        {resultado.diagnostico}
                      </span>
                    </div>
                    <p className="max-w-3xl text-sm leading-7 text-stone-600">
                      {resultado.recomendacion}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4 text-center">
                    <p className="text-3xl font-black text-stone-900">
                      {resultado.puntajeTotal}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      Puntaje
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/resultado/${resultado._id}`}
                    className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
                  >
                    Ver detalle completo
                  </Link>
                  <Link
                    to="/test"
                    className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900"
                  >
                    Realizar de nuevo
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
