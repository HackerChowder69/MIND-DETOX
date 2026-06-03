import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { guardarRutaPostLogin } from "../lib/autenticacion";

export default function PaginaInicio() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const rutaActual = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-teal-700 shadow-sm">
            Salud mental digital
          </div>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-black leading-tight text-stone-900 md:text-6xl">
              Cuanto control tienen
              <span className="block text-teal-700">las redes sobre tu atencion?</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
              MindDetox te ayuda a identificar habitos de uso que pueden estar
              afectando tu descanso, tu concentracion y tu bienestar emocional.
              El test ahora incluye 10 preguntas y un cierre con orientacion
              mas clara segun tu resultado.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/test"
                  className="inline-flex items-center justify-center rounded-full bg-teal-700 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-teal-800/20 transition-all hover:-translate-y-0.5 hover:bg-teal-800"
                >
                  Comenzar test
                </Link>
                <Link
                  to="/mis-resultados"
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/80 px-8 py-3.5 text-sm font-semibold text-stone-700 transition-all hover:-translate-y-0.5 hover:border-stone-500 hover:text-stone-900"
                >
                  Ver mis resultados
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  guardarRutaPostLogin(rutaActual);
                  loginWithRedirect({ appState: { returnTo: rutaActual } });
                }}
                className="inline-flex items-center justify-center rounded-full bg-teal-700 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-teal-800/20 transition-all hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Comenzar test
              </button>
            )}
            <p className="text-sm text-stone-500">
              Inicia sesion para guardar tu historial y consultar resultados.
            </p>
          </div>

          <Link
            to="/panel-admin"
            className="inline-flex w-fit items-center rounded-full border border-stone-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900"
          >
            Acceso administrador
          </Link>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { etiqueta: "Preguntas", valor: "10" },
              { etiqueta: "Duracion", valor: "8-10 min" },
              { etiqueta: "Recursos", valor: "4+" },
            ].map((dato) => (
              <div
                key={dato.etiqueta}
                className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-lg shadow-stone-200/30 backdrop-blur"
              >
                <p className="text-3xl font-black text-stone-900">{dato.valor}</p>
                <p className="mt-1 text-sm text-stone-500">{dato.etiqueta}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] bg-amber-200/40 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-stone-900 p-8 text-white shadow-2xl shadow-stone-900/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-teal-300">
                  Radar de bienestar
                </p>
                <h2 className="mt-3 text-2xl font-bold leading-tight">
                  Detecta senales antes de que el habito se vuelva un problema.
                </h2>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-right backdrop-blur">
                <p className="text-xs uppercase tracking-[0.25em] text-stone-300">
                  Evaluacion
                </p>
                <p className="mt-1 text-2xl font-black">3 niveles</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {[
                "Relaciona tu uso de redes con atencion, descanso y estado emocional.",
                "Recibe una lectura mas desarrollada segun tu puntaje.",
                "Explora enlaces confiables con consejos y apoyo adicional.",
              ].map((texto) => (
                <div
                  key={texto}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-300" />
                  <p className="text-sm leading-6 text-stone-200">{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          {
            titulo: "Observa tus patrones",
            texto:
              "El test no solo mide frecuencia: te ayuda a reconocer momentos en los que las redes interrumpen tu rutina.",
          },
          {
            titulo: "Interpreta tu puntaje",
            texto:
              "Cada resultado incluye contexto y medidas concretas para actuar segun el nivel obtenido.",
          },
          {
            titulo: "Consulta recursos confiables",
            texto:
              "Se integran enlaces de organismos reconocidos para aprender mas y buscar apoyo.",
          },
        ].map((bloque) => (
          <article
            key={bloque.titulo}
            className="rounded-[1.75rem] border border-stone-200/70 bg-white/85 p-6 shadow-lg shadow-stone-200/30"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
              MindDetox
            </p>
            <h3 className="mt-3 text-xl font-bold text-stone-900">
              {bloque.titulo}
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              {bloque.texto}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
