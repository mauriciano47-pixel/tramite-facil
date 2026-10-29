import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calcularFiniquitoLegal, extraerDatosFiniquitoDesdeTexto } from '../js/severanceCalculator.js';

describe('Calculadora y Verificador de Finiquitos (Severance Calculator)', () => {
  it('calcularFiniquitoLegal - Calcula años de servicio, aviso previo y feriado proporcional (Art. 161)', () => {
    const res = calcularFiniquitoLegal({
      sueldoBase: 700000,
      anosTrabajados: 3,
      mesesFraccion: 2, // No supera 6 meses -> computa 3 años
      avisoPrevioDado: false,
      diasVacacionesPendientes: 15,
      causal: 'necesidades_empresa',
      descuentoAfcAporte: 120000
    });

    assert.equal(res.anosComputables, 3);
    assert.equal(res.indemnizacionAnos.replace(/\s/g, ''), '$2.100.000');
    assert.equal(res.indemnizacionAvisoPrevio.replace(/\s/g, ''), '$700.000');
    // Feriado: 700.000 / 30 * 15 = 350.000
    assert.equal(res.feriadoProporcional.replace(/\s/g, ''), '$350.000');
    // Total bruto: 2.100.000 + 700.000 + 350.000 = 3.150.000 - 120.000 = 3.030.000
    assert.equal(res.totalEstimado.replace(/\s/g, ''), '$3.030.000');
    assert.ok(res.textoReserva.includes('descuento indebido de aporte patronal a la AFC'));
    assert.ok(res.textoReserva.includes('despido injustificado'));
  });

  it('calcularFiniquitoLegal - Regla legal: fracción superior a 6 meses suma 1 año completo', () => {
    const res = calcularFiniquitoLegal({
      sueldoBase: 800000,
      anosTrabajados: 2,
      mesesFraccion: 7, // > 6 meses -> suma 1 año -> 3 años computables
      avisoPrevioDado: true, // No cobra mes de aviso
      diasVacacionesPendientes: 0,
      causal: 'necesidades_empresa'
    });

    assert.equal(res.anosComputables, 3);
    assert.equal(res.indemnizacionAnos.replace(/\s/g, ''), '$2.400.000');
    assert.equal(res.indemnizacionAvisoPrevio.replace(/\s/g, ''), '$0');
    assert.equal(res.totalEstimado.replace(/\s/g, ''), '$2.400.000');
  });

  it('calcularFiniquitoLegal - Renuncia voluntaria (Art. 159): Solo paga feriado proporcional', () => {
    const res = calcularFiniquitoLegal({
      sueldoBase: 600000,
      anosTrabajados: 5,
      mesesFraccion: 0,
      avisoPrevioDado: false,
      diasVacacionesPendientes: 10,
      causal: 'renuncia'
    });

    assert.equal(res.indemnizacionAnos.replace(/\s/g, ''), '$0');
    assert.equal(res.indemnizacionAvisoPrevio.replace(/\s/g, ''), '$0');
    // 600.000 / 30 * 10 = 200.000
    assert.equal(res.feriadoProporcional.replace(/\s/g, ''), '$200.000');
    assert.equal(res.totalEstimado.replace(/\s/g, ''), '$200.000');
  });

  it('calcularFiniquitoLegal - Aplica tope legal máximo de 11 años', () => {
    const res = calcularFiniquitoLegal({
      sueldoBase: 1000000,
      anosTrabajados: 18, // 18 años trabajados -> tope 11 años
      mesesFraccion: 8,
      avisoPrevioDado: true,
      diasVacacionesPendientes: 0,
      causal: 'necesidades_empresa'
    });

    assert.equal(res.anosComputables, 11);
    assert.equal(res.indemnizacionAnos.replace(/\s/g, ''), '$11.000.000');
  });

  it('extraerDatosFiniquitoDesdeTexto - Extrae causales y montos desde carta o finiquito real', () => {
    const textoCarta = `
      CARTA DE DESPIDO
      COMUNICAMOS A USTED EL TÉRMINO DE SU CONTRATO DE TRABAJO
      CAUSAL: ARTÍCULO 161 INCISO 1 DEL CÓDIGO DEL TRABAJO (NECESIDADES DE LA EMPRESA)
      
      ÚLTIMA REMUNERACIÓN: $ 650.000
      AÑOS DE SERVICIO: $ 1.300.000
      INDEMNIZACIÓN SUSTITUTIVA AVISO PREVIO: $ 650.000
      FERIADO PROPORCIONAL: $ 216.667
      DESCUENTO APORTE PATRONAL AFC: $ 85.000
      TOTAL A PAGAR: $ 2.731.667
    `;

    const res = extraerDatosFiniquitoDesdeTexto(textoCarta);
    assert.ok(res !== null);
    assert.equal(res.causalDetectada, 'necesidades_empresa');
    assert.equal(res.anosComputables, 2);
    assert.ok(res.textoReserva.includes('descuento indebido de aporte patronal a la AFC'));
  });

  it('extraerDatosFiniquitoDesdeTexto - Devuelve null si no es un documento de despido o finiquito', () => {
    const textoInvalido = 'RECETA MEDICA ATORVASTATINA 20MG CADA 12 HORAS';
    const res = extraerDatosFiniquitoDesdeTexto(textoInvalido);
    assert.equal(res, null);
  });
});
