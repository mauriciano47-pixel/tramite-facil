import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { limpiarMontoNumerico, formatearMoneda, extraerSueldoDesdeTexto } from '../js/ocrEngine.js';

describe('Motor OCR y Parser Heurístico de Remuneraciones', () => {
  it('limpiarMontoNumerico - Limpia y normaliza números con puntos y signos de moneda', () => {
    assert.equal(limpiarMontoNumerico('$ 650.000'), 650000);
    assert.equal(limpiarMontoNumerico('$650.000'), 650000);
    assert.equal(limpiarMontoNumerico('650000'), 650000);
    assert.equal(limpiarMontoNumerico('1.250.500'), 1250500);
    assert.equal(limpiarMontoNumerico('abc'), null);
    assert.equal(limpiarMontoNumerico(''), null);
  });

  it('formatearMoneda - Convierte números a formato de moneda con separador de miles', () => {
    assert.equal(formatearMoneda(650000).replace(/\s/g, ' '), '$650.000');
    assert.equal(formatearMoneda(0), '$0');
  });

  it('extraerSueldoDesdeTexto - Extrae haberes, descuentos y totales de una liquidación real', () => {
    const textoPrueba = `
      CONSTRUCTORA E INMOBILIARIA NORTE SPA
      LIQUIDACION DE SUELDO AGOSTO 2026
      TRABAJADOR: CARLOS MENDEZ ROJAS
      AFP CUPRUM - ISAPRE BANMEDICA
      
      HABERES
      SUELDO BASE $ 720.000
      GRATIFICACION LEGAL $ 180.000
      ASIGNACION MOVILIZACION $ 35.000
      ASIGNACION COLACION $ 45.000
      TOTAL HABERES $ 980.000
      
      DESCUENTOS
      AFP CUPRUM $ 103.320
      SALUD ISAPRE $ 68.600
      SEGURO CESANTIA AFC $ 5.400
      ANTICIPO $ 100.000
      TOTAL DESCUENTOS $ 277.320
      
      LIQUIDO A PAGAR $ 702.680
    `;

    const res = extraerSueldoDesdeTexto(textoPrueba);
    assert.ok(res !== null, 'Debe devolver un objeto salaryBreakdown');
    assert.equal(res.esLecturaReal, true);
    assert.equal(res.totalHaberes.replace(/\s/g, ''), '$980.000');
    assert.equal(res.totalDescuentos.replace(/\s/g, ''), '-$277.320');
    assert.equal(res.liquidoPagar.replace(/\s/g, ''), '$702.680');

    // Verificar haberes desglosados
    const haberesLabels = res.haberes.map(h => h.label);
    assert.ok(haberesLabels.includes('Sueldo Base'));
    assert.ok(haberesLabels.includes('Gratificación Legal'));
    assert.ok(haberesLabels.includes('Asignación de Colación'));
    assert.ok(haberesLabels.includes('Asignación de Movilización'));

    // Verificar descuentos desglosados
    const descLabels = res.descuentos.map(d => d.label);
    assert.ok(descLabels.some(l => l.includes('AFP Cuprum')));
    assert.ok(descLabels.some(l => l.includes('Salud (Isapre)')));
    assert.ok(descLabels.some(l => l.includes('Seguro de Cesantía (AFC)')));
    assert.ok(descLabels.some(l => l.includes('Anticipo')));
  });

  it('extraerSueldoDesdeTexto - Devuelve null ante textos sin información financiera o ilegibles', () => {
    const textoVacio = 'CARTA DE SALUDO FAMILIAR ESTIMADOS AMIGOS';
    const res = extraerSueldoDesdeTexto(textoVacio);
    assert.equal(res, null, 'No debe inventar números si no existen datos numéricos o conceptos');
  });
});
