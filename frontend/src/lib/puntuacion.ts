export type NivelDiagnostico = "Bajo" | "Moderado" | "Alto";

export interface RecursoApoyo {
  descripcion: string;
  fuente: string;
  titulo: string;
  url: string;
}

export const configuracionDiagnostico: Record<
  NivelDiagnostico,
  {
    color: string;
    fondo: string;
    etiqueta: string;
    resumen: string;
    medidas: string[];
    recursos: RecursoApoyo[];
  }
> = {
  Bajo: {
    color: "text-emerald-700",
    fondo: "bg-emerald-50 border-emerald-200",
    etiqueta: "Uso saludable",
    resumen:
      "Tu resultado sugiere que hoy mantienes una relacion bastante estable con las redes sociales. Aun asi, conservar buenos habitos es clave para que el uso digital no empiece a desplazar descanso, estudio o relaciones presenciales.",
    medidas: [
      "Mantener horarios claros para revisar redes y evitar usarlas en cada pausa.",
      "Reservar momentos del dia sin pantalla, sobre todo antes de dormir.",
      "Seguir equilibrando tu rutina con ejercicio, descanso y convivencia presencial.",
    ],
    recursos: [
      {
        titulo: "Como mejorar la salud mental",
        fuente: "MedlinePlus",
        descripcion:
          "Consejos practicos para fortalecer bienestar emocional y poner limites saludables al consumo digital.",
        url: "https://medlineplus.gov/spanish/howtoimprovementalhealth.html",
      },
      {
        titulo: "Salud mental",
        fuente: "OMS",
        descripcion:
          "Panorama general sobre bienestar mental, prevencion y cuidado continuo.",
        url: "https://www.who.int/es/health-topics/mental-health",
      },
    ],
  },
  Moderado: {
    color: "text-amber-700",
    fondo: "bg-amber-50 border-amber-200",
    etiqueta: "Uso moderado",
    resumen:
      "Tu puntaje muestra senales de alerta: las redes sociales ya estan ocupando un espacio importante en tu rutina y conviene intervenir ahora, antes de que afecten con mas fuerza tu concentracion, tu descanso o tu estado de animo.",
    medidas: [
      "Definir bloques concretos para revisar redes en lugar de entrar por impulso.",
      "Silenciar notificaciones no esenciales durante clases, estudio o trabajo.",
      "Hacer una limpieza de contenido que te genere comparacion, ansiedad o saturacion.",
    ],
    recursos: [
      {
        titulo: "5 formas de cuidar tu salud mental en internet",
        fuente: "UNICEF",
        descripcion:
          "Recomendaciones claras para detectar contenido que te afecta y cambiar tus habitos en linea.",
        url: "https://www.unicef.org/uruguay/historias/5-formas-de-cuidar-tu-salud-mental-en-internet",
      },
      {
        titulo: "Salud mental del adolescente",
        fuente: "MedlinePlus",
        descripcion:
          "Informacion util sobre senales de alerta, apoyo y cuando pedir ayuda.",
        url: "https://medlineplus.gov/spanish/teenmentalhealth.html",
      },
      {
        titulo: "Teen mental health and social media",
        fuente: "UNICEF",
        descripcion:
          "Explica riesgos y practicas saludables para relacionarte mejor con redes sociales.",
        url: "https://www.unicef.org/parenting/mental-health/social-media-teens",
      },
    ],
  },
  Alto: {
    color: "text-rose-700",
    fondo: "bg-rose-50 border-rose-200",
    etiqueta: "Dependencia alta",
    resumen:
      "Tu resultado refleja que el uso de redes sociales podria estar afectando areas importantes de tu vida. No significa que todo este fuera de control, pero si que vale la pena tomar medidas concretas desde ahora y buscar acompanamiento si te esta costando hacerlo por tu cuenta.",
    medidas: [
      "Hablar con una persona de confianza o con orientacion psicologica sobre lo que estas viviendo.",
      "Reducir el uso de forma gradual con horarios, descansos y espacios sin telefono.",
      "Pedir apoyo profesional si notas ansiedad, aislamiento, insomnio o impacto academico fuerte.",
    ],
    recursos: [
      {
        titulo: "How to Cope With Mental Health, Drug, and Alcohol Issues",
        fuente: "SAMHSA",
        descripcion:
          "Sugerencias de autocuidado y pasos de apoyo cuando sientes que necesitas intervenir de inmediato.",
        url: "https://www.samhsa.gov/find-support/how-to-cope",
      },
      {
        titulo: "Salud mental",
        fuente: "OMS",
        descripcion:
          "Informacion general sobre por que la salud mental merece atencion y acompanamiento oportuno.",
        url: "https://www.who.int/es/health-topics/mental-health",
      },
      {
        titulo: "Salud mental y conducta",
        fuente: "MedlinePlus",
        descripcion:
          "Directorio amplio de temas relacionados con ansiedad, bienestar emocional y apoyo profesional.",
        url: "https://medlineplus.gov/spanish/mentalhealthandbehavior.html",
      },
    ],
  },
};

export const OPCIONES_ESCALA = [
  { valor: 1, etiqueta: "Nunca" },
  { valor: 2, etiqueta: "Raramente" },
  { valor: 3, etiqueta: "A veces" },
  { valor: 4, etiqueta: "Con frecuencia" },
  { valor: 5, etiqueta: "Siempre" },
];
