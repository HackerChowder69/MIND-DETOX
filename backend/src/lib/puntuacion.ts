import { NivelDiagnostico } from "../models/Resultado";

interface ResultadoDiagnostico {
  diagnostico: NivelDiagnostico;
  recomendacion: string;
}

export const calcularDiagnostico = (puntaje: number): ResultadoDiagnostico => {
  if (puntaje <= 20) {
    return {
      diagnostico: "Bajo",
      recomendacion:
        "Tu resultado apunta a un uso relativamente saludable de las redes sociales. Aunque no se observan senales fuertes de dependencia, vale la pena conservar rutinas que protejan tu concentracion, tu descanso y tus relaciones presenciales. Mantener horarios definidos, evitar el uso automatico al despertar o antes de dormir y reservar momentos sin pantalla puede ayudarte a sostener ese equilibrio.",
    };
  }

  if (puntaje <= 35) {
    return {
      diagnostico: "Moderado",
      recomendacion:
        "Tu puntaje muestra patrones de uso que ya podrian empezar a afectar algunas areas de tu vida diaria. Este es un buen momento para intervenir con medidas concretas: reducir notificaciones, asignar horarios para revisar redes, identificar que contenidos te generan ansiedad o comparacion y recuperar espacios de descanso o estudio sin interrupciones. Actuar ahora puede evitar que el problema se intensifique.",
    };
  }

  return {
    diagnostico: "Alto",
    recomendacion:
      "Tu resultado sugiere un nivel alto de dependencia o malestar asociado al uso de redes sociales. Si notas ansiedad al desconectarte, dificultad para controlar el tiempo en pantalla, problemas de sueno, aislamiento o afectacion academica, es recomendable buscar apoyo adicional. Puedes comenzar con una desconexion gradual y estructurada, pero tambien conviene hablar con un profesional de salud mental o con una persona de confianza que te ayude a sostener cambios reales.",
  };
};
