import test from 'node:test';
import assert from 'node:assert/strict';
import { plantillasGenericasPorDefecto, obtenerTextoBorrador } from '../js/draftGenerator.js';

test('Generador de Escritos - Existencia y Estructura de Plantillas Estándar', () => {
  assert.ok(plantillasGenericasPorDefecto.prorroga);
  assert.ok(plantillasGenericasPorDefecto.justificantes);
  assert.ok(plantillasGenericasPorDefecto.descargo);

  assert.ok(plantillasGenericasPorDefecto.prorroga.includes("EXPONE:"));
  assert.ok(plantillasGenericasPorDefecto.prorroga.includes("SOLICITA:"));
  assert.ok(plantillasGenericasPorDefecto.prorroga.includes("[TU NOMBRE Y APELLIDOS]"));
});

test('Generador de Escritos - Reemplazo de Fecha Dinámica en Borrador', () => {
  const borrador = obtenerTextoBorrador('prorroga');
  assert.ok(!borrador.includes("[FECHA ACTUAL]"), "El placeholder [FECHA ACTUAL] debe haber sido sustituido");
  assert.ok(borrador.includes("En [CIUDAD], a "), "Debe incluir el encabezado de lugar y fecha");
});

test('Generador de Escritos - Prioridad de Plantillas Especializadas del Documento Activo', () => {
  const customData = {
    draftTemplates: {
      prorroga: "ESCRITO ESPECIALIZADO DE ACLARACIÓN LABORAL PARA [FECHA ACTUAL]"
    }
  };

  const borrador = obtenerTextoBorrador('prorroga', customData);
  assert.ok(borrador.startsWith("ESCRITO ESPECIALIZADO DE ACLARACIÓN LABORAL"));
  assert.ok(!borrador.includes("[FECHA ACTUAL]"));
});

test('Generador de Escritos - Fallback ante Tipo Desconocido', () => {
  const borrador = obtenerTextoBorrador('tipo_inexistente');
  assert.ok(borrador.includes("Solicitud de ampliación de plazo / prórroga administrativa"));
});
