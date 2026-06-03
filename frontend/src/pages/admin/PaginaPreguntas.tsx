import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import {
  obtenerTodasLasPreguntas,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
} from "../../api/preguntas";
import type { Pregunta } from "../../api/preguntas";
import FormularioPregunta from "../../forms/FormularioPregunta";
import { obtenerTokenApi } from "../../lib/autenticacion";

export default function PaginaPreguntas() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const clienteConsulta = useQueryClient();
  const [preguntaEditando, setPreguntaEditando] = useState<Pregunta | null>(
    null
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const {
    data: preguntas,
    isLoading: cargando,
    isError,
    error,
  } = useQuery({
    queryKey: ["todasLasPreguntas"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const token = await obtenerTokenApi(getAccessTokenSilently);
      return obtenerTodasLasPreguntas(token);
    },
  });

  const mutacionCrear = useMutation({
    mutationFn: async (datos: { texto: string; orden: number }) => {
      const token = await obtenerTokenApi(getAccessTokenSilently);
      return crearPregunta(token, datos);
    },
    onSuccess: () => {
      toast.success("Pregunta creada");
      clienteConsulta.invalidateQueries({ queryKey: ["todasLasPreguntas"] });
      setMostrarFormulario(false);
    },
    onError: () => toast.error("Error al crear pregunta"),
  });

  const mutacionActualizar = useMutation({
    mutationFn: async (datos: {
      id: string;
      texto: string;
      orden: number;
      activa: boolean;
    }) => {
      const token = await obtenerTokenApi(getAccessTokenSilently);
      return actualizarPregunta(token, datos.id, {
        texto: datos.texto,
        orden: datos.orden,
        activa: datos.activa,
      });
    },
    onSuccess: () => {
      toast.success("Pregunta actualizada");
      clienteConsulta.invalidateQueries({ queryKey: ["todasLasPreguntas"] });
      setPreguntaEditando(null);
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const mutacionEliminar = useMutation({
    mutationFn: async (id: string) => {
      const token = await obtenerTokenApi(getAccessTokenSilently);
      return eliminarPregunta(token, id);
    },
    onSuccess: () => {
      toast.success("Pregunta eliminada");
      clienteConsulta.invalidateQueries({ queryKey: ["todasLasPreguntas"] });
    },
    onError: () => toast.error("Error al eliminar"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Preguntas</h1>
          <p className="text-sm text-stone-500 mt-1">
            Gestiona los reactivos del test MindDetox
          </p>
        </div>
        <button
          onClick={() => {
            setMostrarFormulario(true);
            setPreguntaEditando(null);
          }}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          + Nueva pregunta
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Nueva pregunta</h2>
          <FormularioPregunta
            alEnviar={(datos) =>
              mutacionCrear.mutate(
                datos as { texto: string; orden: number }
              )
            }
            cargando={mutacionCrear.isPending}
          />
        </div>
      )}

      {cargando ? (
        <p className="text-stone-400 text-sm">Cargando...</p>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-white p-6">
          <p className="font-medium text-stone-700">
            No se pudieron cargar las preguntas.
          </p>
          <p className="mt-2 text-sm text-stone-500">
            {error instanceof Error
              ? error.message
              : "Ocurrio un error al consultar el backend."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {preguntas?.map((pregunta) => (
            <div
              key={pregunta._id}
              className="bg-white border border-stone-200 rounded-xl p-5"
            >
              {preguntaEditando?._id === pregunta._id ? (
                <FormularioPregunta
                  valoresPorDefecto={pregunta}
                  alEnviar={(datos) =>
                    mutacionActualizar.mutate({
                      id: pregunta._id,
                      texto: datos.texto,
                      orden: datos.orden,
                      activa: datos.activa ?? pregunta.activa,
                    })
                  }
                  cargando={mutacionActualizar.isPending}
                />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                        #{pregunta.orden}
                      </span>
                      {!pregunta.activa && (
                        <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <p className="text-stone-700 text-sm">{pregunta.texto}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setPreguntaEditando(pregunta)}
                      className="text-xs text-stone-500 hover:text-stone-800 border border-stone-200 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Eliminar esta pregunta?")) {
                          mutacionEliminar.mutate(pregunta._id);
                        }
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700 border border-rose-100 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
