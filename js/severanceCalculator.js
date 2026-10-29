// Módulo de Cálculo y Verificación de Finiquitos e Indemnizaciones Laborales para TrámiteFácil
// Cumple con el Código del Trabajo y la Ley 21.361 sobre Reserva de Derechos

import { limpiarMontoNumerico, formatearMoneda } from './ocrEngine.js';

/**
 * Calcula las indemnizaciones legales de un finiquito
 * @param {object} params
 * @param {number} params.sueldoBase Remuneración mensual íntegra
 * @param {number} params.anosTrabajados Años de servicio cumplidos
 * @param {number} [params.mesesFraccion=0] Meses adicionales sobre los años cumplidos
 * @param {boolean} [params.avisoPrevioDado=false] Si el empleador avisó con 30 días de anticipación
 * @param {number} [params.diasVacacionesPendientes=0] Días hábiles de feriado legal no gozados
 * @param {string} [params.causal='necesidades_empresa'] 'necesidades_empresa' | 'renuncia' | 'plazo_fijo' | 'disciplinaria'
 * @param {number} [params.descuentoAfcAporte=0] Descuento pretendido por la empresa por aporte a la AFC
 * @returns {object}
 */
export function calcularFiniquitoLegal({
  sueldoBase = 0,
  anosTrabajados = 0,
  mesesFraccion = 0,
  avisoPrevioDado = false,
  diasVacacionesPendientes = 0,
  causal = 'necesidades_empresa',
  descuentoAfcAporte = 0
}) {
  const sueldo = Math.max(0, sueldoBase);
  const anos = Math.max(0, anosTrabajados);
  const meses = Math.max(0, mesesFraccion);
  const vacaciones = Math.max(0, diasVacacionesPendientes);

  // Regla legal chilena (Art. 163): Fracción superior a 6 meses suma 1 año completo de indemnización (Tope legal: 11 años)
  let anosComputables = anos;
  if (meses > 6) {
    anosComputables += 1;
  }
  anosComputables = Math.min(11, anosComputables);

  let indemnizacionAnos = 0;
  let indemnizacionAvisoPrevio = 0;

  // Causal Art. 161 (Necesidades de la empresa)
  if (causal === 'necesidades_empresa') {
    indemnizacionAnos = anosComputables * sueldo;
    if (!avisoPrevioDado) {
      indemnizacionAvisoPrevio = sueldo; // 1 mes de sueldo sustitutivo
    }
  }

  // Feriado Proporcional (Art. 73): Remuneración diaria x días pendientes
  // Remuneración diaria = sueldo / 30
  const valorDia = sueldo > 0 ? sueldo / 30 : 0;
  const feriadoProporcional = Math.round(valorDia * vacaciones);

  // Subtotal a favor del trabajador
  const totalBruto = indemnizacionAnos + indemnizacionAvisoPrevio + feriadoProporcional;

  // Monto neto final
  const totalLiquidoFiniquito = Math.max(0, totalBruto - Math.max(0, descuentoAfcAporte));

  // Generación pedagógica de la Cláusula de Reserva de Derechos (Ley 21.361)
  const motivosReserva = [];
  if (descuentoAfcAporte > 0) {
    motivosReserva.push("descuento indebido de aporte patronal a la AFC");
  }
  if (!avisoPrevioDado && causal === 'necesidades_empresa') {
    motivosReserva.push("pago de indemnización sustitutiva de aviso previo");
  }
  if (causal === 'necesidades_empresa') {
    motivosReserva.push("reserva por eventual demanda de despido injustificado o improcedente");
  }
  if (vacaciones > 0) {
    motivosReserva.push("diferencias en cálculo de feriado legal proporcional");
  }
  motivosReserva.push("remuneraciones, cotizaciones previsionales pendientes y horas extraordinarias");

  const textoReserva = `Me reservo expresamente el derecho a demandar y reclamar ante la Dirección del Trabajo y Tribunales de Justicia por: ${motivosReserva.join(", ")}.`;

  return {
    sueldoBase: formatearMoneda(sueldo),
    anosComputables,
    indemnizacionAnos: formatearMoneda(indemnizacionAnos),
    indemnizacionAvisoPrevio: formatearMoneda(indemnizacionAvisoPrevio),
    feriadoProporcional: formatearMoneda(feriadoProporcional),
    descuentoAfcAporte: formatearMoneda(descuentoAfcAporte),
    totalEstimado: formatearMoneda(totalLiquidoFiniquito),
    textoReserva,
    aplicaIndemnizacionAnos: causal === 'necesidades_empresa' && anosComputables > 0,
    aplicaAvisoPrevio: causal === 'necesidades_empresa' && !avisoPrevioDado
  };
}

/**
 * Analiza un texto de carta de despido o finiquito y extrae los datos clave
 * @param {string} rawText 
 * @returns {object | null}
 */
export function extraerDatosFiniquitoDesdeTexto(rawText = "") {
  if (!rawText) return null;
  const textLower = rawText.toLowerCase();

  // Verificar si el documento trata sobre despido o finiquito
  const esFiniquitoODespido =
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
    textLower.includes("anos de servicio");

  if (!esFiniquitoODespido) return null;

  // Detectar causal
  let causal = 'necesidades_empresa';
  if (textLower.includes("renuncia voluntaria") || textLower.includes("renuncio a mi cargo")) {
    causal = 'renuncia';
  } else if (textLower.includes("vencimiento del plazo") || textLower.includes("plazo convenido") || textLower.includes("artículo 159 n") || textLower.includes("articulo 159 n")) {
    causal = 'plazo_fijo';
  } else if (textLower.includes("artículo 160") || textLower.includes("articulo 160") || textLower.includes("conducta indebida") || textLower.includes("falta de probidad")) {
    causal = 'disciplinaria';
  }

  // Detectar montos
  const lineas = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let sueldoBaseDetectado = null;
  let totalFiniquitoDetectado = null;
  let anosServicioMonto = null;
  let avisoPrevioMonto = null;
  let feriadoMonto = null;
  let descuentoAfcMonto = 0;

  for (const linea of lineas) {
    const lLower = linea.toLowerCase();
    const monto = limpiarMontoNumerico(linea);
    if (!monto) continue;

    if (lLower.includes("sueldo base") || lLower.includes("última remuneración") || lLower.includes("ultima remuneracion") || lLower.includes("base de cálculo") || lLower.includes("base de calculo")) {
      sueldoBaseDetectado = monto;
    } else if (lLower.includes("años de servicio") || lLower.includes("anos de servicio") || lLower.includes("indemnización por años") || lLower.includes("indemnizacion por anos")) {
      anosServicioMonto = monto;
    } else if (lLower.includes("aviso previo") || lLower.includes("falta de aviso") || lLower.includes("desahucio")) {
      avisoPrevioMonto = monto;
    } else if (lLower.includes("feriado") || lLower.includes("vacaciones")) {
      feriadoMonto = monto;
    } else if (lLower.includes("afc") && (lLower.includes("descuento") || lLower.includes("aporte patronal") || lLower.includes("retención") || lLower.includes("retencion"))) {
      descuentoAfcMonto = monto;
    } else if (lLower.includes("total finiquito") || lLower.includes("total a pagar") || lLower.includes("saldo a favor del trabajador") || lLower.includes("total a percibir")) {
      totalFiniquitoDetectado = monto;
    }
  }

  // Intentar deducir años si tenemos el monto de años y el sueldo base
  let anosEstimados = 1;
  if (anosServicioMonto && sueldoBaseDetectado && sueldoBaseDetectado > 0) {
    anosEstimados = Math.round(anosServicioMonto / sueldoBaseDetectado);
  }

  const sueldoFinal = sueldoBaseDetectado || (anosServicioMonto ? Math.round(anosServicioMonto / Math.max(1, anosEstimados)) : 650000);
  const avisoDado = textLower.includes("aviso previo de 30 días") && !avisoPrevioMonto;

  const calculo = calcularFiniquitoLegal({
    sueldoBase: sueldoFinal,
    anosTrabajados: anosEstimados,
    mesesFraccion: 0,
    avisoPrevioDado: avisoDado,
    diasVacacionesPendientes: feriadoMonto && sueldoFinal > 0 ? Math.round(feriadoMonto / (sueldoFinal / 30)) : 10,
    causal,
    descuentoAfcAporte: descuentoAfcMonto
  });

  return {
    ...calculo,
    causalDetectada: causal,
    montoFiniquitoDetectado: totalFiniquitoDetectado ? formatearMoneda(totalFiniquitoDetectado) : calculo.totalEstimado,
    esFiniquitoReal: true
  };
}
