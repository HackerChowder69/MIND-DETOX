import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { guardarRutaPostLogin } from "../lib/autenticacion";

export default function LayoutPrincipal() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const rutaActual = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),linear-gradient(180deg,_#f7f7f4_0%,_#eef7f5_52%,_#f8fafc_100%)] text-stone-800">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(90deg,_rgba(13,148,136,0.12),_rgba(245,158,11,0.1),_rgba(255,255,255,0))]" />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-700 text-sm font-black tracking-[0.2em] text-white shadow-lg shadow-teal-900/20">
              MD
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-stone-900">
                MindDetox
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                Bienestar digital
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/mis-resultados"
                  className="rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:border-teal-400 hover:text-teal-900"
                >
                  Mis resultados
                </Link>
                <span className="hidden rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-stone-600 shadow-sm backdrop-blur sm:block">
                  {user?.email}
                </span>
                <button
                  onClick={() =>
                    logout({ logoutParams: { returnTo: window.location.origin } })
                  }
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  guardarRutaPostLogin(rutaActual);
                  loginWithRedirect({ appState: { returnTo: rutaActual } });
                }}
                className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-stone-900/15 transition-colors hover:bg-stone-700"
              >
                Iniciar sesion
              </button>
            )}
          </div>
        </nav>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200/80 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-stone-600 md:flex-row md:items-center md:justify-between">
          <p className="font-medium text-stone-700">
            MindDetox | Instituto Tecnologico de Zacatecas
          </p>
          <p>Proyecto academico orientado a reflexionar sobre el uso digital.</p>
        </div>
      </footer>
    </div>
  );
}
