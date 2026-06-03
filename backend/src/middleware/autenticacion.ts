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
  const correo = carga?.["https://minddetox.com/email"] || carga?.email;
  const sub = carga?.sub;
  const adminSub = process.env.ADMIN_SUB;

  const esAdminPorCorreo =
    !!correo && correo === process.env.CORREO_ADMIN;
  const esAdminPorSub = !!sub && !!adminSub && sub === adminSub;

  if (!esAdminPorCorreo && !esAdminPorSub) {
    res.status(403).json({ error: "Acceso denegado" });
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
