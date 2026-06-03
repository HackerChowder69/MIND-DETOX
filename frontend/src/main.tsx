import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/auth0-react";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

const clienteConsulta = new QueryClient();
const obtenerRutaRetorno = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      cacheLocation="localstorage"
      onRedirectCallback={(appState) => {
        const rutaDestino = appState?.returnTo || obtenerRutaRetorno();
        window.history.replaceState({}, document.title, rutaDestino);
      }}
      authorizationParams={{
        redirect_uri:
          import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <QueryClientProvider client={clienteConsulta}>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
