// Módulo de Clasificación Heurística y Utilidades de Red para TrámiteFácil

/**
 * Clasifica un texto en una categoría de trámite conocida según palabras clave
 * @param {string} textVal Texto del documento
 * @returns {"hacienda" | "multa" | "juzgado" | "sueldo" | "custom"}
 */
export function clasificarTexto(textVal = "") {
  if (!textVal) return "custom";
  const textLower = textVal.toLowerCase();

  // Detección prioritaria de notificaciones tributarias o hacienda
  if (
    textLower.includes("hacienda") ||
    textLower.includes("irpf") ||
    textLower.includes("impuesto") ||
    textLower.includes("tributari") ||
    textLower.includes("renta")
  ) {
    return "hacienda";
  }

  // Detección de liquidaciones de sueldo / remuneraciones laborales
  if (
    textLower.includes("sueldo") ||
    textLower.includes("remuneracion") ||
    textLower.includes("remuneración") ||
    textLower.includes("nomina") ||
    textLower.includes("nómina") ||
    textLower.includes("imponible") ||
    textLower.includes("afp") ||
    textLower.includes("fonasa") ||
    textLower.includes("isapre") ||
    textLower.includes("gratificacion") ||
    textLower.includes("gratificación") ||
    textLower.includes("liquido a pagar") ||
    textLower.includes("líquido a pagar") ||
    textLower.includes("liquidacion de sueldo") ||
    textLower.includes("liquidación de sueldo") ||
    textLower.includes("liquidacion mensual") ||
    textLower.includes("liquidación mensual") ||
    textLower.includes("haberes")
  ) {
    return "sueldo";
  }

  // Detección de citaciones judiciales y tribunales
  if (
    textLower.includes("juez") ||
    textLower.includes("juzgado") ||
    textLower.includes("tribunal") ||
    textLower.includes("citación") ||
    textLower.includes("citacion") ||
    textLower.includes("demanda")
  ) {
    return "juzgado";
  }

  // Detección de multas de tráfico y vialidad
  if (
    textLower.includes("multa") ||
    textLower.includes("velocidad") ||
    textLower.includes("radar") ||
    textLower.includes("tráfico") ||
    textLower.includes("trafico") ||
    textLower.includes("transito") ||
    textLower.includes("tránsito")
  ) {
    return "multa";
  }

  return "custom";
}

/**
 * Clasifica un archivo por su nombre cuando se procesa de forma simulada
 * @param {string} fileName 
 * @returns {"hacienda" | "multa" | "juzgado" | "custom"}
 */
export function clasificarArchivo(fileName = "") {
  if (!fileName) return "custom";
  const nameLower = fileName.toLowerCase();

  if (nameLower.includes("hacienda") || nameLower.includes("renta") || nameLower.includes("impuesto")) {
    return "hacienda";
  }
  if (nameLower.includes("multa") || nameLower.includes("velocidad") || nameLower.includes("transito") || nameLower.includes("trafico")) {
    return "multa";
  }
  if (nameLower.includes("citacion") || nameLower.includes("citación") || nameLower.includes("juzgado") || nameLower.includes("demanda")) {
    return "juzgado";
  }
  if (nameLower.includes("sueldo") || nameLower.includes("nomina") || nameLower.includes("nómina") || nameLower.includes("remuneracion")) {
    return "sueldo";
  }
  return "custom";
}

/**
 * Limpia y parsea cadenas JSON devueltas por modelos de IA con bloques markdown
 * @param {string} rawText 
 * @returns {object}
 */
export function limpiarYParsearJSON(rawText) {
  if (!rawText) throw new Error("Texto vacío para parsear JSON");
  let clean = rawText.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json\s*/i, "");
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```\s*/, "");
  }
  if (clean.endsWith("```")) {
    clean = clean.replace(/```\s*$/, "");
  }
  return JSON.parse(clean.trim());
}

/**
 * Ejecuta una petición HTTP con timeout estricto para evitar bloqueos por cuota o red lenta
 * @param {string} url 
 * @param {RequestInit} [options={}] 
 * @param {number} [timeoutMs=8000] 
 * @returns {Promise<Response>}
 */
export async function fetchConTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Convierte un archivo File/Blob a Base64 puro (sin prefijo de data URL)
 * @param {File | Blob} file 
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      return reject(new Error("FileReader no está disponible en este entorno"));
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64Data = typeof result === 'string' ? result.split(',')[1] : '';
      resolve(base64Data);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
