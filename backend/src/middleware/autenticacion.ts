import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const normalizarUrlAuth0 = (valor?: string) => {
  if (!valor) return undefined;
  const url = /^https?:\/\//i.test(valor) ? valor : `https://${valor}`;
  return url.replace(/\/$/, "");
};

const issuerBaseURL = normalizarUrlAuth0(
  process.env.AUTH0_ISSUER_BASE_URL || process.env.AUTH0_DOMAIN
);

const obtenerValoresEnv = (valor?: string) =>
  (valor || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizarCorreo = (valor?: string) =>
  valor?.trim().toLowerCase() || "";

export const requiereAutenticacion = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL,
  tokenSigningAlg: "RS256",
});

export const requiereAdmin = (
  req: Request,
  res: Response,
  siguiente: NextFunction
): void => {
  const carga = (req as any).auth?.payload;
  const correo = normalizarCorreo(
    carga?.["https://minddetox.com/email"] || carga?.email
  );
  const sub = typeof carga?.sub === "string" ? carga.sub.trim() : "";
  const correosAdmin = obtenerValoresEnv(process.env.CORREO_ADMIN).map(
    normalizarCorreo
  );
  const subsAdmin = obtenerValoresEnv(process.env.ADMIN_SUB);

  const esAdminPorCorreo =
    !!correo && correosAdmin.includes(correo);
  const esAdminPorSub = !!sub && subsAdmin.includes(sub);

  if (!esAdminPorCorreo && !esAdminPorSub) {
    console.error("Acceso admin denegado:", {
      sub,
      correo,
      tieneAdminSubConfigurado: subsAdmin.length > 0,
      tieneCorreoAdminConfigurado: correosAdmin.length > 0,
    });

    res.status(403).json({
      error: "Acceso denegado",
      mensaje:
        "Tu usuario autenticado no coincide con CORREO_ADMIN ni ADMIN_SUB configurados en el backend.",
      usuario: { sub, correo },
    });
    return;
  }
  siguiente();
};

export const manejarErrorAutenticacion = (
  error: any,
  _req: Request,
  res: Response,
  siguiente: NextFunction
): void => {
  if (error?.status === 401 || error?.code === "invalid_token") {
    console.error("Error Auth0:", {
      name: error.name,
      code: error.code,
      message: error.message,
      status: error.status,
    });

    res.status(error.status || 401).json({
      error: error.code || "unauthorized",
      mensaje: error.message || "Unauthorized",
    });
    return;
  }

  siguiente(error);
};
