// Módulo de Reconocimiento Óptico de Caracteres (OCR) y Análisis Heurístico Real de Liquidaciones para TrámiteFácil
// Permite extraer texto de imágenes directamente en el navegador del usuario sin requerir API Key externa

/**
 * Carga Tesseract.js de forma dinámica bajo demanda
 * @returns {Promise<any>}
 */
export async function cargarTesseract() {
  if (typeof window !== 'undefined' && window.Tesseract) {
    return window.Tesseract;
  }
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error("Entorno sin DOM"));
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Tesseract) resolve(window.Tesseract);
      else reject(new Error("Tesseract no se inicializó correctamente"));
    };
    script.onerror = () => reject(new Error("No se pudo cargar el motor OCR desde CDN. Verifica tu conexión a internet."));
    document.head.appendChild(script);
  });
}

/**
 * Extrae texto de un archivo File o Blob de imagen usando OCR en español
 * @param {File | Blob} fileOrBlob 
 * @param {(pct: number, status: string) => void} [onProgress]
 * @returns {Promise<string>}
 */
export async function extraerTextoDeImagen(fileOrBlob, onProgress = null) {
  const Tesseract = await cargarTesseract();
  
  if (onProgress) onProgress(10, "Iniciando motor de reconocimiento óptico...");
  
  const worker = await Tesseract.createWorker('spa', 1, {
    logger: m => {
      if (m && m.status === 'recognizing text' && onProgress) {
        const pct = Math.round((m.progress || 0) * 80) + 15;
        onProgress(pct, `Leyendo documento... ${pct}%`);
      }
    }
  });

  if (onProgress) onProgress(20, "Analizando píxeles y estructura del documento...");

  const ret = await worker.recognize(fileOrBlob);
  await worker.terminate();

  return (ret && ret.data && ret.data.text) ? ret.data.text.trim() : "";
}

/**
 * Parsea un monto de dinero desde un string (ej: "$ 650.000", "650000", "650.000", "650,000")
 * @param {string} str 
 * @returns {number | null}
 */
export function limpiarMontoNumerico(str) {
  if (!str) return null;
  // Extraer patrones numéricos que parecen dinero (más de 3 dígitos)
  const match = str.match(/\$?\s*([0-9]{1,3}(?:[.,][0-9]{3})+|[0-9]{4,9})/);
  if (!match) return null;
  const numLimpio = match[1].replace(/[.,\s]/g, "");
  const valor = parseInt(numLimpio, 10);
  return isNaN(valor) || valor <= 0 ? null : valor;
}

/**
 * Formatea un número entero como moneda chilena/latinoamericana (ej: "$650.000")
 * @param {number} num 
 * @returns {string}
 */
export function formatearMoneda(num) {
  if (typeof num !== 'number' || isNaN(num)) return "$0";
  return "$" + Math.round(num).toLocaleString('es-CL');
}

/**
 * Analiza el texto real extraído de una liquidación de sueldo y extrae haberes y descuentos reales
 * @param {string} rawText Texto OCR o pegado
 * @returns {object | null} Retorna objeto salaryBreakdown o null si no se pudieron detectar cifras
 */
export function extraerSueldoDesdeTexto(rawText = "") {
  if (!rawText) return null;

  const lineas = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const textLower = rawText.toLowerCase();

  const haberes = [];
  const descuentos = [];

  let sueldoBaseDetectado = null;
  let gratificacionDetectada = null;
  let totalHaberesDetectado = null;
  let totalDescuentosDetectado = null;
  let liquidoDetectado = null;

  // Lista de AFPs chilenas conocidas para personalizar glosa
  const afpsConocidas = ["habitat", "provida", "cuprum", "modelo", "planvital", "capital", "uno"];
  let afpNombreEncontrado = "AFP Previsión";
  for (const afp of afpsConocidas) {
    if (textLower.includes(afp)) {
      afpNombreEncontrado = `AFP ${afp.charAt(0).toUpperCase() + afp.slice(1)}`;
      break;
    }
  }

  // Analizar línea por línea
  for (const linea of lineas) {
    const lLower = linea.toLowerCase();
    const monto = limpiarMontoNumerico(linea);

    if (!monto) continue;

    // Detectar Sueldo Base
    if (lLower.includes("sueldo base") || lLower.includes("sueldo basico") || lLower.includes("sueldo mensual") || lLower.includes("salario base")) {
      sueldoBaseDetectado = monto;
      haberes.push({
        label: "Sueldo Base",
        amount: formatearMoneda(monto),
        type: "imponible",
        desc: "Monto base mensual fijado por contrato de trabajo"
      });
      continue;
    }

    // Detectar Gratificación
    if (lLower.includes("gratificac")) {
      gratificacionDetectada = monto;
      haberes.push({
        label: "Gratificación Legal",
        amount: formatearMoneda(monto),
        type: "imponible",
        desc: "25% legal con tope mensual de remuneración"
      });
      continue;
    }

    // Detectar Horas Extras
    if (lLower.includes("hora extra") || lLower.includes("horas extra") || lLower.includes("sobretiempo")) {
      haberes.push({
        label: "Horas Extraordinarias",
        amount: formatearMoneda(monto),
        type: "imponible",
        desc: "Pago de jornada adicional trabajada con recargo legal"
      });
      continue;
    }

    // Detectar No Imponibles (Colación / Movilización)
    if (lLower.includes("colac") || lLower.includes("alimento")) {
      haberes.push({
        label: "Asignación de Colación",
        amount: formatearMoneda(monto),
        type: "no-imponible",
        desc: "Haber no imponible destinado a alimentación (entra íntegro al bolsillo)"
      });
      continue;
    }

    if (lLower.includes("movilizac") || lLower.includes("transporte") || lLower.includes("viatico") || lLower.includes("viático")) {
      haberes.push({
        label: "Asignación de Movilización",
        amount: formatearMoneda(monto),
        type: "no-imponible",
        desc: "Haber no imponible para gastos de traslado"
      });
      continue;
    }

    // Detectar Descuento Salud (Fonasa / Isapre 7%)
    if (lLower.includes("fonasa") || lLower.includes("isapre") || lLower.includes("salud 7") || (lLower.includes("salud") && !lLower.includes("seguro"))) {
      descuentos.push({
        label: lLower.includes("isapre") ? "Salud (Isapre)" : "Salud (Fonasa 7%)",
        amount: "-" + formatearMoneda(monto),
        desc: "7% legal obligatorio para cobertura médica"
      });
      continue;
    }

    // Detectar Descuento Previsión / AFP
    if (lLower.includes("afp") || lLower.includes("prevision") || lLower.includes("previsión") || lLower.includes("cotizacion obligatoria") || lLower.includes("cotización obligatoria")) {
      descuentos.push({
        label: `${afpNombreEncontrado} (10% + Comisión)`,
        amount: "-" + formatearMoneda(monto),
        desc: "10% de ahorro previsional para jubilación + comisión de administración"
      });
      continue;
    }

    // Detectar Seguro de Cesantía (AFC)
    if (lLower.includes("afc") || lLower.includes("cesantia") || lLower.includes("cesantía") || lLower.includes("seguro desempleo")) {
      descuentos.push({
        label: "Seguro de Cesantía (AFC)",
        amount: "-" + formatearMoneda(monto),
        desc: "Aporte para tu fondo de cesantía individual (solo en contrato indefinido)"
      });
      continue;
    }

    // Detectar Impuesto Único
    if (lLower.includes("impuesto unico") || lLower.includes("impuesto único") || lLower.includes("retencion tributaria") || lLower.includes("retención tributaria")) {
      descuentos.push({
        label: "Impuesto Único de Segunda Categoría",
        amount: "-" + formatearMoneda(monto),
        desc: "Retención fiscal obligatoria para sueldos que superan el tramo exento"
      });
      continue;
    }

    // Detectar Anticipos
    if (lLower.includes("anticipo") || lLower.includes("adelanto") || lLower.includes("prestamo") || lLower.includes("préstamo")) {
      descuentos.push({
        label: "Anticipo de Remuneración",
        amount: "-" + formatearMoneda(monto),
        desc: "Adelanto de sueldo percibido durante el mes"
      });
      continue;
    }

    // Totales de cierre
    if (lLower.includes("total haberes") || lLower.includes("total ganado") || lLower.includes("total imponible") || lLower.includes("total bruto")) {
      totalHaberesDetectado = monto;
      continue;
    }

    if (lLower.includes("total descuento") || lLower.includes("total retenc") || lLower.includes("total a descontar")) {
      totalDescuentosDetectado = monto;
      continue;
    }

    if (lLower.includes("liquido a pagar") || lLower.includes("líquido a pagar") || lLower.includes("liquido a percibir") || lLower.includes("líquido a percibir") || lLower.includes("alcance liquido") || lLower.includes("alcance líquido") || lLower.includes("total liquido") || lLower.includes("total líquido")) {
      liquidoDetectado = monto;
      continue;
    }
  }

  // Si no se detectó ningún número en todo el texto, no es posible construir un desglose real
  if (haberes.length === 0 && descuentos.length === 0 && !liquidoDetectado && !sueldoBaseDetectado) {
    return null;
  }

  // Si no encontramos desglose de haberes pero sí tenemos sueldo base
  if (haberes.length === 0 && sueldoBaseDetectado) {
    haberes.push({
      label: "Sueldo Base Detectado",
      amount: formatearMoneda(sueldoBaseDetectado),
      type: "imponible",
      desc: "Remuneración base registrada en el documento"
    });
  }

  // Cálculo de sumas reales
  const sumaHaberes = haberes.reduce((acc, h) => acc + (limpiarMontoNumerico(h.amount) || 0), 0);
  const sumaDescuentos = descuentos.reduce((acc, d) => acc + (limpiarMontoNumerico(d.amount) || 0), 0);

  const totalHaberesFinal = totalHaberesDetectado || (sumaHaberes > 0 ? sumaHaberes : (sueldoBaseDetectado || 0));
  const totalDescuentosFinal = totalDescuentosDetectado || sumaDescuentos;
  const liquidoFinal = liquidoDetectado || (totalHaberesFinal - totalDescuentosFinal);

  return {
    totalHaberes: formatearMoneda(totalHaberesFinal),
    totalDescuentos: "-" + formatearMoneda(totalDescuentosFinal),
    liquidoPagar: formatearMoneda(liquidoFinal > 0 ? liquidoFinal : 0),
    haberes: haberes.length > 0 ? haberes : [
      {
        label: "Total Haberes Leídos",
        amount: formatearMoneda(totalHaberesFinal),
        type: "imponible",
        desc: "Monto bruto total detectado en tu documento"
      }
    ],
    descuentos: descuentos.length > 0 ? descuentos : [
      {
        label: "Descuentos Previsionales y Legales",
        amount: "-" + formatearMoneda(totalDescuentosFinal),
        desc: "Deducciones legales de salud, previsión y cesantía detectadas en tu documento"
      }
    ],
    esLecturaReal: true
  };
}
