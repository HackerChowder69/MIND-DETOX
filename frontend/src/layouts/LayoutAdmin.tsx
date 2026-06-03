import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { esCorreoAdmin, guardarRutaPostLogin } from "../lib/autenticacion";

export default function LayoutAdmin() {
  const { logout, isAuthenticated, loginWithRedirect, user } = useAuth0();
  const ubicacion = useLocation();
  const rutaActual = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  const elementosNav = [
    { ruta: "/admin", etiqueta: "Tablero" },
    { ruta: "/admin/usuarios", etiqueta: "Usuarios" },
    { ruta: "/admin/preguntas", etiqueta: "Preguntas" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-6">
        <div className="w-full max-w-xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-lg shadow-stone-200/40">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
            Acceso administrativo
          </p>
          <h1 className="mt-3 text-3xl font-black text-stone-900">
            Inicia sesion para entrar al panel
          </h1>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Esta seccion solo esta disponible para usuarios autenticados con
            permisos de administracion.
          </p>
          <button
            onClick={() => {
              guardarRutaPostLogin(rutaActual);
              loginWithRedirect({ appState: { returnTo: rutaActual } });
            }}
            className="mt-6 rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
          >
            Iniciar sesion
          </button>
        </div>
      </div>
    );
  }

  if (!esCorreoAdmin(user?.email)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-6">
        <div className="w-full max-w-2xl rounded-[2rem] border border-amber-200 bg-white p-8 shadow-lg shadow-stone-200/40">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Acceso denegado
          </p>
          <h1 className="mt-3 text-3xl font-black text-stone-900">
            Esta cuenta no puede entrar al panel de administrador
          </h1>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            La sesion actual corresponde a <strong>{user?.email}</strong>. Para
            ver todos los datos necesitas iniciar sesion con el correo de
            administrador.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
            >
              Cambiar de cuenta
            </button>
            <Link
              to="/panel-admin"
              className="rounded-full border border-stone-300 bg-white px-6 py-3 text-center text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900"
            >
              Ir al acceso administrativo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-stone-100">
      <aside className="w-56 bg-white border-r border-stone-200 flex flex-col">
        <div className="px-6 py-5 border-b border-stone-200">
          <span className="font-bold text-teal-700">MindDetox</span>
          <p className="text-xs text-stone-400 mt-0.5">Administracion</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {elementosNav.map((elemento) => (
            <Link
              key={elemento.ruta}
              to={elemento.ruta}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                ubicacion.pathname === elemento.ruta
                  ? "bg-teal-50 text-teal-700"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {elemento.etiqueta}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-stone-200">
          <p className="mb-3 text-xs text-stone-400">{user?.email}</p>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
          >
            Cerrar sesion
          </button>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
