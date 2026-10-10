import test from 'node:test';
import assert from 'node:assert/strict';
import { responderConsultaHeuristica } from '../js/chatAssistant.js';
import { TRAMITE_EXAMPLES } from '../data.js';

test('Chat Clarificador - Respuesta a Consultas sobre Descuento de Salud', () => {
  const respuesta = responderConsultaHeuristica("¿Por qué me descuentan el 7% de Fonasa o salud?", TRAMITE_EXAMPLES.sueldo);
  assert.ok(respuesta.includes("7%"));
  assert.ok(respuesta.toLowerCase().includes("salud") || respuesta.toLowerCase().includes("médica"));
});

test('Chat Clarificador - Respuesta a Consultas sobre Previsión / AFP', () => {
  const respuesta = responderConsultaHeuristica("¿Qué es la AFP y para qué sirve el descuento de pensión?", TRAMITE_EXAMPLES.sueldo);
  assert.ok(respuesta.toLowerCase().includes("afp") || respuesta.toLowerCase().includes("pensión") || respuesta.toLowerCase().includes("previs"));
});

test('Chat Clarificador - Respuesta a Consultas sobre Seguro de Cesantía (AFC)', () => {
  const respuesta = responderConsultaHeuristica("¿Qué significa el cobro de cesantía o AFC?", TRAMITE_EXAMPLES.sueldo);
  assert.ok(respuesta.toLowerCase().includes("cesantía") || respuesta.toLowerCase().includes("desempleo") || respuesta.toLowerCase().includes("afc"));
});

test('Chat Clarificador - Respuesta a Consultas sobre Plazos en Notificación de Hacienda', () => {
  const respuesta = responderConsultaHeuristica("¿Cuánto tiempo o qué plazo tengo para contestar?", TRAMITE_EXAMPLES.hacienda);
  assert.ok(respuesta.toLowerCase().includes("días hábiles") || respuesta.toLowerCase().includes("plazo"));
});

test('Chat Clarificador - Respuesta a Consultas sobre Inasistencia a Juzgado', () => {
  const respuesta = responderConsultaHeuristica("¿Qué pasa si no puedo ir o falto a la citación?", TRAMITE_EXAMPLES.juzgado);
  assert.ok(respuesta.toLowerCase().includes("orden") || respuesta.toLowerCase().includes("incomparecencia") || respuesta.toLowerCase().includes("justificar") || respuesta.toLowerCase().includes("rebeldia"));
});

test('Chat Clarificador - Fallback Seguro cuando no hay Datos Activos', () => {
  const respuesta = responderConsultaHeuristica("¿Qué significa esto?", null);
  assert.ok(respuesta.includes("días hábiles"));
});
