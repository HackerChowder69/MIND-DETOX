const CLAVE_RUTA_POST_LOGIN = "minddetox_post_login_path";
const CORREO_ADMIN_POR_DEFECTO = "l22450607@itz.edu.mx";

export const guardarRutaPostLogin = (ruta: string) => {
  window.localStorage.setItem(CLAVE_RUTA_POST_LOGIN, ruta);
};

export const consumirRutaPostLogin = () => {
  const ruta = window.localStorage.getItem(CLAVE_RUTA_POST_LOGIN);

  if (ruta) {
    window.localStorage.removeItem(CLAVE_RUTA_POST_LOGIN);
  }

  return ruta;
};

export const obtenerCorreoAdminConfigurado = () =>
  import.meta.env.VITE_ADMIN_EMAIL || CORREO_ADMIN_POR_DEFECTO;

export const esCorreoAdmin = (correo?: string | null) =>
  !!correo &&
  correo.toLowerCase() === obtenerCorreoAdminConfigurado().toLowerCase();
