import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { consumirRutaPostLogin } from "../lib/autenticacion";

export default function RedireccionPostLogin() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navegar = useNavigate();

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const rutaPendiente = consumirRutaPostLogin();

    if (rutaPendiente) {
      navegar(rutaPendiente, { replace: true });
    }
  }, [isAuthenticated, isLoading, navegar]);

  return null;
}
