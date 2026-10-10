import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularTotalesSueldo, generarResumenVozSueldo } from '../js/salaryBreakdown.js';

test('Radiografía Salarial - Cálculo de Haberes y Descuentos con Formato Monetario', () => {
  const haberes = [
    { label: "Sueldo Base", amount: "$650.000", type: "imponible" },
    { label: "Gratificación Legal", amount: "$175.000", type: "imponible" },
    { label: "Bono Colación", amount: "$45.000", type: "no-imponible" },
    { label: "Bono Movilización", amount: "$35.000", type: "no-imponible" }
  ];

  const descuentos = [
    { label: "Salud (Fonasa 7%)", amount: "-$57.750" },
    { label: "Previsión (AFP 11.45%)", amount: "-$94.462" },
    { label: "Seguro Cesantía (0.6%)", amount: "-$4.950" }
  ];

  const resultado = calcularTotalesSueldo(haberes, descuentos);

  assert.equal(resultado.totalImponible, 825000);
  assert.equal(resultado.totalNoImponible, 80000);
  assert.equal(resultado.totalHaberes, 905000);
  assert.equal(resultado.totalDescuentos, 157162);
  assert.equal(resultado.liquidoEstimado, 905000 - 157162);
});

test('Radiografía Salarial - Resiliencia ante listas vacías o valores faltantes', () => {
  const resultado = calcularTotalesSueldo([], []);
  assert.equal(resultado.totalHaberes, 0);
  assert.equal(resultado.totalDescuentos, 0);
  assert.equal(resultado.liquidoEstimado, 0);
});

test('Radiografía Salarial - Generación de Resumen de Voz Accesible', () => {
  const mockBreakdown = {
    totalHaberes: "$905.000",
    totalDescuentos: "-$157.162",
    liquidoPagar: "$747.838",
    descuentos: [
      { label: "Salud Fonasa", amount: "$57.750", desc: "Aporte del 7% obligatorio para cobertura médica." }
    ]
  };

  const resumenVoz = generarResumenVozSueldo(mockBreakdown);
  assert.ok(resumenVoz.includes("Total ganado bruto: $905.000"));
  assert.ok(resumenVoz.includes("Total de descuentos obligatorios: -$157.162"));
  assert.ok(resumenVoz.includes("Sueldo líquido que entra a tu cuenta: $747.838"));
  assert.ok(resumenVoz.includes("Salud Fonasa"));
});
