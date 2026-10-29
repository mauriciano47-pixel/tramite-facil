// Módulo de Clasificación Heurística y Utilidades de Red para TrámiteFácil

/**
 * Clasifica un texto en una categoría de trámite conocida según palabras clave
 * @param {string} textVal Texto del documento
 * @returns {"hacienda" | "multa" | "juzgado" | "sueldo" | "pgu" | "ges" | "contribuciones" | "poder" | "custom"}
 */
export function clasificarTexto(textVal = "") {
  if (!textVal) return "custom";
  const textLower = textVal.toLowerCase();

  // Detección de Poder Simple y Mandatos Familiares (Máxima prioridad)
  if (
    textLower.includes("poder simple") ||
    textLower.includes("poder especial") ||
    textLower.includes("mandato simple") ||
    textLower.includes("autorizo a") ||
    textLower.includes("cobro de pensión") ||
    textLower.includes("cobro de pension") ||
    textLower.includes("retiro de medicamentos") ||
    textLower.includes("retiro de remedios") ||
    textLower.includes("representación de adulto mayor") ||
    textLower.includes("representacion de adulto mayor")
  ) {
    return "poder";
  }

  // Detección de Garantías Explícitas en Salud (GES / AUGE) y Fonasa
  if (
    textLower.includes("ges") ||
    textLower.includes("auge") ||
    textLower.includes("segundo prestador") ||
    textLower.includes("garantía explícita") ||
    textLower.includes("garantia explicita") ||
    textLower.includes("constancia ges") ||
    textLower.includes("patología ges") ||
    textLower.includes("patologia ges") ||
    textLower.includes("lista de espera") ||
    textLower.includes("cataratas") ||
    textLower.includes("artrosis")
  ) {
    return "ges";
  }

  // Detección de Contribuciones de Bienes Raíces (Impuesto Territorial Adulto Mayor)
  if (
    textLower.includes("contribucion") ||
    textLower.includes("contribución") ||
    textLower.includes("contribuciones") ||
    textLower.includes("impuesto territorial") ||
    textLower.includes("avaluo fiscal") ||
    textLower.includes("avalúo fiscal") ||
    textLower.includes("rol de avalúo") ||
    textLower.includes("rol de avaluo") ||
    textLower.includes("bienes raíces") ||
    textLower.includes("bienes raices")
  ) {
    return "contribuciones";
  }

  // Detección de Pensiones, PGU y trámites del IPS / ChileAtiende
  if (
    textLower.includes("pgu") ||
    textLower.includes("pensión garantizada") ||
    textLower.includes("pension garantizada") ||
    textLower.includes("chileatiende") ||
    textLower.includes("instituto de previsión social") ||
    textLower.includes("instituto de prevision social") ||
    textLower.includes("jubilacion") ||
    textLower.includes("jubilación") ||
    textLower.includes("montepio") ||
    textLower.includes("montepío") ||
    textLower.includes("pilar solidario") ||
    (textLower.includes("pension") && !textLower.includes("alimento")) ||
    (textLower.includes("pensión") && !textLower.includes("alimento"))
  ) {
    return "pgu";
  }

  // Detección de Finiquitos Laborales y Cartas de Despido (Prioridad sobre sueldo general)
  if (
    textLower.includes("finiquito") ||
    textLower.includes("carta de despido") ||
    textLower.includes("término de contrato") ||
    textLower.includes("termino de contrato") ||
    textLower.includes("término de la relación laboral") ||
    textLower.includes("termino de la relacion laboral") ||
    textLower.includes("necesidades de la empresa") ||
    textLower.includes("artículo 161") ||
    textLower.includes("articulo 161") ||
    textLower.includes("art. 161") ||
    textLower.includes("años de servicio") ||
    textLower.includes("anos de servicio") ||
    textLower.includes("despido")
  ) {
    return "finiquito";
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

  // Detección tributaria de Hacienda o SII general
  if (
    textLower.includes("hacienda") ||
    textLower.includes("irpf") ||
    textLower.includes("impuesto") ||
    textLower.includes("tributari") ||
    textLower.includes("renta")
  ) {
    return "hacienda";
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
 * @returns {"hacienda" | "multa" | "juzgado" | "sueldo" | "pgu" | "ges" | "contribuciones" | "poder" | "custom"}
 */
export function clasificarArchivo(fileName = "") {
  if (!fileName) return "custom";
  const nameLower = fileName.toLowerCase();

  if (nameLower.includes("pgu") || nameLower.includes("pension") || nameLower.includes("jubilac") || nameLower.includes("ips")) {
    return "pgu";
  }
  if (nameLower.includes("ges") || nameLower.includes("auge") || nameLower.includes("salud") || nameLower.includes("hospital")) {
    return "ges";
  }
  if (nameLower.includes("contribuc") || nameLower.includes("territorial") || nameLower.includes("avaluo") || nameLower.includes("bienes_raices")) {
    return "contribuciones";
  }
  if (nameLower.includes("poder") || nameLower.includes("mandato") || nameLower.includes("autoriza")) {
    return "poder";
  }
  if (nameLower.includes("finiquito") || nameLower.includes("despido") || nameLower.includes("termino_contrato")) {
    return "finiquito";
  }
  if (nameLower.includes("sueldo") || nameLower.includes("nomina") || nameLower.includes("remunerac")) {
    return "sueldo";
  }
  if (nameLower.includes("hacienda") || nameLower.includes("renta") || nameLower.includes("impuesto")) {
    return "hacienda";
  }
  if (nameLower.includes("multa") || nameLower.includes("velocidad") || nameLower.includes("transito") || nameLower.includes("trafico")) {
    return "multa";
  }
  if (nameLower.includes("citacion") || nameLower.includes("juzgado") || nameLower.includes("demanda")) {
    return "juzgado";
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
