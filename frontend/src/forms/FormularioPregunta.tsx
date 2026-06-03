import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Pregunta } from "../api/preguntas";

const esquema = z.object({
  texto: z.string().min(5, "La pregunta debe tener al menos 5 caracteres"),
  orden: z.number().min(0, "El orden debe ser mayor o igual a 0"),
  activa: z.boolean().optional(),
});

type DatosFormulario = z.infer<typeof esquema>;

interface PropiedadesFormulario {
  valoresPorDefecto?: Partial<Pregunta>;
  alEnviar: (datos: DatosFormulario) => void;
  cargando?: boolean;
}

export default function FormularioPregunta({
  valoresPorDefecto,
  alEnviar,
  cargando,
}: PropiedadesFormulario) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormulario>({
    resolver: zodResolver(esquema),
    defaultValues: {
      texto: valoresPorDefecto?.texto || "",
      orden: valoresPorDefecto?.orden || 0,
      activa: valoresPorDefecto?.activa ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(alEnviar)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Texto de la pregunta
        </label>
        <textarea
          {...register("texto")}
          rows={3}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="¿Con qué frecuencia...?"
        />
        {errors.texto && (
          <p className="text-xs text-rose-500 mt-1">{errors.texto.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Orden
        </label>
        <input
          type="number"
          {...register("orden", { valueAsNumber: true })}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {errors.orden && (
          <p className="text-xs text-rose-500 mt-1">{errors.orden.message}</p>
        )}
      </div>

      {valoresPorDefecto && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("activa")}
            id="activa"
            className="rounded"
          />
          <label htmlFor="activa" className="text-sm text-stone-600">
            Pregunta activa
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="w-full bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
      >
        {cargando ? "Guardando..." : "Guardar pregunta"}
      </button>
    </form>
  );
}
