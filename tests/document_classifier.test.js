import test from 'node:test';
import assert from 'node:assert/strict';
import { clasificarTexto, clasificarArchivo, limpiarYParsearJSON } from '../js/documentClassifier.js';

test('Clasificador de Documentos - Detección de Liquidación de Sueldo', () => {
  const textoLiquidacion = "Liquidación de Remuneraciones: Sueldo Base $650.000, Total Imponible $820.000, Descuento AFP Habitat y Fonasa 7%, Líquido a Pagar $680.000.";
  assert.equal(clasificarTexto(textoLiquidacion), "sueldo");
});

test('Clasificador de Documentos - Detección de Notificación de Hacienda / Tributaria', () => {
  const textoHacienda = "Agencia Tributaria: Notificación de propuesta de liquidación provisional referente al IRPF del ejercicio fiscal 2025.";
  assert.equal(clasificarTexto(textoHacienda), "hacienda");
});

test('Clasificador de Documentos - Detección de Multa de Tráfico', () => {
  const textoMulta = "Dirección General de Tráfico: Infracción captada por cinemómetro radar en vía interurbana por exceso de velocidad permitida.";
  assert.equal(clasificarTexto(textoMulta), "multa");
});

test('Clasificador de Documentos - Detección de Citación Judicial', () => {
  const textoJuzgado = "Juzgado de Letras del Trabajo: Se le cita a comparecer a la audiencia de juicio fijada para el 15 de noviembre.";
  assert.equal(clasificarTexto(textoJuzgado), "juzgado");
});

test('Clasificador de Documentos - Fallback a Custom para texto genérico', () => {
  const textoGenerico = "Estimado vecino, le invitamos a la reunión de la junta de vecinos del próximo sábado en la sede comunitaria.";
  assert.equal(clasificarTexto(textoGenerico), "custom");
  assert.equal(clasificarTexto(""), "custom");
});

test('Clasificador de Documentos - Clasificación por Nombre de Archivo', () => {
  assert.equal(clasificarArchivo("notificacion_hacienda_renta.pdf"), "hacienda");
  assert.equal(clasificarArchivo("foto_multa_velocidad_radar.jpg"), "multa");
  assert.equal(clasificarArchivo("citacion_juzgado_civil.png"), "juzgado");
  assert.equal(clasificarArchivo("liquidacion_sueldo_septiembre.pdf"), "sueldo");
  assert.equal(clasificarArchivo("carta_desconocida.pdf"), "custom");
});

test('Parser JSON - Limpieza de Bloques Markdown de Gemini', () => {
  const jsonConMarkdown = "```json\n{\n  \"what\": \"Notificación IRPF\",\n  \"translation\": \"Pagar impuestos\"\n}\n```";
  const parsed = limpiarYParsearJSON(jsonConMarkdown);
  assert.equal(parsed.what, "Notificación IRPF");
  assert.equal(parsed.translation, "Pagar impuestos");

  const jsonCrudo = '{"what": "Multa radar", "translation": "Velocidad excesiva"}';
  const parsed2 = limpiarYParsearJSON(jsonCrudo);
  assert.equal(parsed2.what, "Multa radar");
});
