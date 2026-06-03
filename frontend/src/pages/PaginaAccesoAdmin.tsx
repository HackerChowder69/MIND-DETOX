import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  esCorreoAdmin,
  guardarRutaPostLogin,
  obtenerCorreoAdminConfigurado,
} from "../lib/autenticacion";

export default function PaginaAccesoAdmin() {
  const { isAuthenticated, isLoading, loginWithRedirect, user, logout } =
    useAuth0();

  const manejarAccesoAdmin = async () => {
    guardarRutaPostLogin("/admin/usuarios");
    await loginWithRedirect({
      appState: { returnTo: "/admin/usuarios" },
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-stone-200 bg-white/80 px-6 py-10 text-center text-stone-400 shadow-lg shadow-stone-200/30">
        Verificando acceso...
      </div>
    );
  }

  if (isAuthenticated && esCorreoAdmin(user?.email)) {
    return <Navigate to="/admin/usuarios" replace />;
  }

  if (isAuthenticated) {
    return (
      <div className="space-y-5 rounded-[2rem] border border-amber-200 bg-white/90 p-8 shadow-lg shadow-stone-200/30">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Acceso restringido
          </p>
          <h1 className="mt-3 text-3xl font-black text-stone-900">
            Esta cuenta no tiene permisos de administrador
          </h1>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Iniciaste sesion con <strong>{user?.email}</strong>, pero el panel
            administrativo esta configurado para el correo{" "}
            <strong>{obtenerCorreoAdminConfigurado()}</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
          >
            Cambiar de cuenta
          </button>
          <Link
            to="/"
            className="rounded-full border border-stone-300 bg-white px-6 py-3 text-center text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <section className="rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-lg shadow-stone-200/30">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
          Panel administrativo
        </p>
        <h1 className="mt-3 text-4xl font-black text-stone-900">
          Acceso a datos completos de MindDetox
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
          Inicia sesion con el correo de administrador para entrar directamente
          al panel donde puedes ver usuarios registrados, resultados del test y
          estadisticas generales.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={manejarAccesoAdmin}
            className="rounded-full bg-teal-700 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-teal-800/20 transition-all hover:-translate-y-0.5 hover:bg-teal-800"
          >
            Iniciar sesion como administrador
          </button>
          <Link
            to="/"
            className="rounded-full border border-stone-300 bg-white px-8 py-3.5 text-center text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900"
          >
            Volver al inicio
          </Link>
        </div>
      </section>

      <aside className="rounded-[2rem] border border-stone-200/80 bg-stone-900 p-6 text-white shadow-xl shadow-stone-900/15">
        <p className="text-xs uppercase tracking-[0.25em] text-teal-300">
          Cuenta esperada
        </p>
        <p className="mt-3 text-xl font-bold">{obtenerCorreoAdminConfigurado()}</p>
        <p className="mt-4 text-sm leading-7 text-stone-300">
          Si usas otro correo, el acceso administrativo no se habilitara aunque
          el inicio de sesion sea correcto.
        </p>
      </aside>
    </div>
  );
}
