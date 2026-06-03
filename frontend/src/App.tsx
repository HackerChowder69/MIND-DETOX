import { Routes, Route } from "react-router-dom";
import PaginaInicio from "./pages/PaginaInicio.tsx";
import PaginaTest from "./pages/PaginaTest.tsx";
import PaginaResultado from "./pages/PaginaResultado.tsx";
import PaginaMisResultados from "./pages/PaginaMisResultados.tsx";
import PaginaAccesoAdmin from "./pages/PaginaAccesoAdmin.tsx";
import PaginaTablero from "./pages/admin/PaginaTablero.tsx";
import PaginaPreguntas from "./pages/admin/PaginaPreguntas.tsx";
import PaginaUsuariosResultados from "./pages/admin/PaginaUsuariosResultados.tsx";
import LayoutPrincipal from "./layouts/LayoutPrincipal.tsx";
import LayoutAdmin from "./layouts/LayoutAdmin.tsx";
import RedireccionPostLogin from "./components/RedireccionPostLogin.tsx";

export default function App() {
  return (
    <>
      <RedireccionPostLogin />
      <Routes>
        <Route element={<LayoutPrincipal />}>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/test" element={<PaginaTest />} />
          <Route path="/mis-resultados" element={<PaginaMisResultados />} />
          <Route path="/resultado/:id" element={<PaginaResultado />} />
          <Route path="/panel-admin" element={<PaginaAccesoAdmin />} />
        </Route>
        <Route element={<LayoutAdmin />}>
          <Route path="/admin" element={<PaginaTablero />} />
          <Route path="/admin/preguntas" element={<PaginaPreguntas />} />
          <Route
            path="/admin/usuarios"
            element={<PaginaUsuariosResultados />}
          />
        </Route>
      </Routes>
    </>
  );
}
