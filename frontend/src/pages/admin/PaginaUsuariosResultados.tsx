import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { obtenerUsuariosConResultados } from "../../api/resultados";
import { configuracionDiagnostico } from "../../lib/puntuacion";

const formatearFecha = (fecha: string) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));

export default function PaginaUsuariosResultados() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [busqueda, setBusqueda] = useState("");

  const {
    data: usuarios,
    isLoading: cargando,
    isError,
    error,
  } = useQuery({
    queryKey: ["usuariosConResultados"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return obtenerUsuariosConResultados(token);
    },
  });

  const usuariosFiltrados =
    usuarios?.filter((usuario) => {
      const termino = busqueda.trim().toLowerCase();

      if (!termino) return true;

      return [usuario.nombreUsuario, usuario.correoUsuario, usuario.usuarioId]
        .filter(Boolean)
        .some((valor) => valor!.toLowerCase().includes(termino));
    }) || [];

  if (cargando) {
    return <p className="text-sm text-stone-400">Cargando usuarios...</p>;
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-xl border border-rose-200 bg-white p-6">
        <p className="font-medium text-stone-700">
          No se pudieron cargar los usuarios registrados.
        </p>
        <p className="text-sm text-stone-500">
          {error instanceof Error
            ? error.message
            : "Ocurrio un error al consultar el backend."}
        </p>
        <p className="text-sm text-stone-500">
          Si el mensaje es `Acceso denegado`, inicia sesion con la cuenta
          administradora configurada en el backend.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Usuarios y resultados
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Consulta las personas con resultados registrados y revisa su
            historial del test.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Buscar usuario
          </span>
          <input
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Correo, nombre o ID"
            className="w-full min-w-[280px] rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition-colors focus:border-teal-500"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-2xl font-bold text-stone-900">
            {usuarios?.length || 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">Usuarios con tests</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-2xl font-bold text-stone-900">
            {usuarios?.reduce((total, usuario) => total + usuario.totalTests, 0) ||
              0}
          </p>
          <p className="mt-1 text-xs text-stone-500">Tests acumulados</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-2xl font-bold text-stone-900">
            {usuariosFiltrados.length}
          </p>
          <p className="mt-1 text-xs text-stone-500">Coincidencias actuales</p>
        </div>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
          No hay usuarios que coincidan con la busqueda actual.
        </div>
      ) : (
        <div className="space-y-5">
          {usuariosFiltrados.map((usuario) => (
            <section
              key={usuario.usuarioId || usuario.correoUsuario}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 border-b border-stone-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {usuario.nombreUsuario || usuario.correoUsuario}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {usuario.correoUsuario}
                  </p>
                  <p className="mt-2 text-xs text-stone-400">
                    ID: {usuario.usuarioId}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                    <p className="text-xl font-bold text-stone-900">
                      {usuario.totalTests}
                    </p>
                    <p className="text-xs text-stone-500">Tests</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                    <p className="text-xl font-bold text-stone-900">
                      {usuario.promedioPuntaje}
                    </p>
                    <p className="text-xs text-stone-500">Promedio</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                    <p className="text-xl font-bold text-stone-900">
                      {usuario.ultimoResultado.diagnostico}
                    </p>
                    <p className="text-xs text-stone-500">Ultimo nivel</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {usuario.resultados.map((resultado) => {
                  const configuracion =
                    configuracionDiagnostico[resultado.diagnostico];

                  return (
                    <article
                      key={resultado._id}
                      className="rounded-[1.25rem] border border-stone-100 bg-stone-50 px-4 py-4"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                            {formatearFecha(resultado.creadoEn)}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <span className="text-lg font-bold text-stone-900">
                              {resultado.puntajeTotal} puntos
                            </span>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${configuracion.fondo} ${configuracion.color}`}
                            >
                              {resultado.diagnostico}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-stone-600">
                            {resultado.recomendacion}
                          </p>
                        </div>

                        <div className="min-w-[220px] rounded-xl border border-stone-200 bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                            Respuestas registradas
                          </p>
                          <p className="mt-2 text-2xl font-bold text-stone-900">
                            {resultado.respuestas.length}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
