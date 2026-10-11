// Suite de Pruebas Automatizadas para TrámiteFácil v1.4.0 (Senior-First & Trámites 3ra Edad)
import assert from 'assert';
import { TRAMITE_EXAMPLES } from './data.js';
import { clasificarTexto, clasificarArchivo, limpiarYParsearJSON } from './js/documentClassifier.js';
import { obtenerTextoBorrador, plantillasGenericasPorDefecto } from './js/draftGenerator.js';
import { responderConsultaHeuristica } from './js/chatAssistant.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

console.log("\n=======================================================");
console.log("🧪 INICIANDO SUITE DE TESTS: TRÁMITEFÁCIL v1.4.0 (3RA EDAD)");
console.log("=======================================================\n");

// 1. Verificación de Integridad de la Base de Datos
console.log("📁 1. VERIFICACIÓN DE TRÁMITES EN DATA.JS:");

const requiredCategories = ['hacienda', 'multa', 'juzgado', 'sueldo', 'pgu', 'ges', 'contribuciones', 'poder'];

requiredCategories.forEach(cat => {
  test(`Catálogo contiene categoría '${cat}' completa`, () => {
    const item = TRAMITE_EXAMPLES[cat];
    assert(item, `Falta la categoría ${cat}`);
    assert(item.what && typeof item.what === 'string', `Falta 'what' en ${cat}`);
    assert(item.translation && typeof item.translation === 'string', `Falta 'translation' en ${cat}`);
    assert(Array.isArray(item.steps) && item.steps.length > 0, `Faltan 'steps' en ${cat}`);
    assert(Array.isArray(item.docs) && item.docs.length > 0, `Faltan 'docs' en ${cat}`);
    assert(Array.isArray(item.warns) && item.warns.length > 0, `Faltan 'warns' en ${cat}`);
    assert(item.chatResponses && typeof item.chatResponses === 'object', `Faltan 'chatResponses' en ${cat}`);
    assert(item.draftTemplates && typeof item.draftTemplates === 'object', `Faltan 'draftTemplates' en ${cat}`);
    assert(item.draftTemplates.prorroga, `Falta plantilla 'prorroga' en ${cat}`);
    assert(item.draftTemplates.justificantes, `Falta plantilla 'justificantes' en ${cat}`);
    assert(item.draftTemplates.descargo, `Falta plantilla 'descargo' en ${cat}`);
  });
});

// 2. Clasificador de Textos Heurístico
console.log("\n🔍 2. CLASIFICADOR DE TEXTOS (SENIOR & CIUDADANO):");

test("Detección de Pensión y PGU (IPS)", () => {
  assert.strictEqual(clasificarTexto("Carta de ChileAtiende sobre mi pensión garantizada universal PGU"), "pgu");
  assert.strictEqual(clasificarTexto("Notificación de jubilacion del instituto de prevision social"), "pgu");
  assert.strictEqual(clasificarTexto("Consulta por montepío y pilar solidario"), "pgu");
});

test("Detección de Garantías Explícitas en Salud (GES / AUGE)", () => {
  assert.strictEqual(clasificarTexto("Notificación de constancia GES por patología de cataratas en lista de espera"), "ges");
  assert.strictEqual(clasificarTexto("Incumplimiento de plazo de segundo prestador Fonasa auge"), "ges");
  assert.strictEqual(clasificarTexto("Tratamiento de artrosis garantizado por ley"), "ges");
});

test("Detección de Contribuciones e Impuesto Territorial para Adultos Mayores", () => {
  assert.strictEqual(clasificarTexto("Cobro de contribuciones de bienes raíces con avalúo fiscal y rol 1234"), "contribuciones");
  assert.strictEqual(clasificarTexto("Aviso de impuesto territorial de mi casa habitacional"), "contribuciones");
});

test("Detección de Poder Simple Familiar", () => {
  assert.strictEqual(clasificarTexto("Poder simple para cobro de pensión y retiro de medicamentos en cesfam"), "poder");
  assert.strictEqual(clasificarTexto("Mandato simple donde autorizo a mi hijo para trámites"), "poder");
});

test("Detección de Liquidación de Sueldo", () => {
  assert.strictEqual(clasificarTexto("Liquidación de sueldo haberes imponibles afp fonasa"), "sueldo");
});

test("Detección de Trámites Judiciales, Multas y Hacienda", () => {
  assert.strictEqual(clasificarTexto("Citación del juzgado de policía local por demanda"), "juzgado");
  assert.strictEqual(clasificarTexto("Multa por exceso de velocidad de tránsito y radar"), "multa");
  assert.strictEqual(clasificarTexto("Requerimiento de Hacienda sobre deducciones IRPF renta"), "hacienda");
  assert.strictEqual(clasificarTexto("Texto desconocido cualquiera sin palabras clave"), "custom");
});

// 3. Clasificador de Archivos
console.log("\n📁 3. CLASIFICADOR DE ARCHIVOS POR NOMBRE:");

test("Clasificación de nombres de archivo de la 3ra edad", () => {
  assert.strictEqual(clasificarArchivo("carta_pgu_ips_2026.pdf"), "pgu");
  assert.strictEqual(clasificarArchivo("constancia_ges_fonasa.jpg"), "ges");
  assert.strictEqual(clasificarArchivo("boleta_contribuciones_sii.pdf"), "contribuciones");
  assert.strictEqual(clasificarArchivo("poder_simple_familiar.docx"), "poder");
  assert.strictEqual(clasificarArchivo("liquidacion_sueldo_octubre.pdf"), "sueldo");
  assert.strictEqual(clasificarArchivo("multa_transito_radar.jpg"), "multa");
  assert.strictEqual(clasificarArchivo("citacion_juzgado.pdf"), "juzgado");
  assert.strictEqual(clasificarArchivo("notificacion_hacienda.pdf"), "hacienda");
  assert.strictEqual(clasificarArchivo("foto_papel_12345.jpg"), "custom");
});

// 4. Generador de Borradores Contextuales
console.log("\n✍️ 4. GENERADOR DE BORRADORES Y CARTAS OFICIALES:");

test("Borrador de Reconsideración de PGU", () => {
  const pguData = TRAMITE_EXAMPLES.pgu;
  const texto = obtenerTextoBorrador('prorroga', pguData);
  assert(texto.includes("INSTITUTO DE PREVISIÓN SOCIAL"), "Debe mencionar al IPS");
  assert(texto.includes("Pensión Garantizada Universal"), "Debe mencionar la PGU");
  assert(!texto.includes("[FECHA ACTUAL]"), "Debe reemplazar la fecha actual automáticamente");
});

test("Borrador de Segundo Prestador GES", () => {
  const gesData = TRAMITE_EXAMPLES.ges;
  const texto = obtenerTextoBorrador('prorroga', gesData);
  assert(texto.includes("FONASA"), "Debe mencionar Fonasa o Isapre");
  assert(texto.includes("Segundo Prestador"), "Debe exigir Segundo Prestador");
  assert(texto.includes("48 HORAS"), "Debe invocar el plazo legal de 48 horas");
});

test("Borrador de Rebaja de Contribuciones Adulto Mayor", () => {
  const contData = TRAMITE_EXAMPLES.contribuciones;
  const texto = obtenerTextoBorrador('prorroga', contData);
  assert(texto.includes("SERVICIO DE IMPUESTOS INTERNOS"), "Debe dirigirse al SII");
  assert(texto.includes("Adulto Mayor"), "Debe mencionar beneficio Adulto Mayor");
  assert(texto.includes("ROL DE LA PROPIEDAD"), "Debe contemplar el Rol del inmueble");
});

test("Borrador de Poder Simple Familiar", () => {
  const poderData = TRAMITE_EXAMPLES.poder;
  const texto = obtenerTextoBorrador('prorroga', poderData);
  assert(texto.includes("PODER SIMPLE PARA COBRO DE PENSIÓN"), "Debe titularse Poder Simple");
  assert(texto.includes("FIRMA DEL ADULTO MAYOR"), "Debe tener pie de firma del adulto mayor");
  assert(texto.includes("FIRMA DEL FAMILIAR"), "Debe tener pie de firma del familiar");
});

// 5. Asistente Conversacional Heurístico
console.log("\n💬 5. ASISTENTE CONVERSACIONAL HEURÍSTICO:");

test("Consultas de PGU sobre plazos y requisitos", () => {
  const pguData = TRAMITE_EXAMPLES.pgu;
  const respPlazo = responderConsultaHeuristica("¿Cuánto plazo tengo para responder?", pguData);
  assert(respPlazo.includes("30 días"), "Debe indicar los 30 días de plazo del IPS");

  const respDoc = responderConsultaHeuristica("¿Qué papeles tengo que llevar?", pguData);
  assert(respDoc.includes("Cédula") || respDoc.includes("Residencia"), "Debe indicar carnet y residencia");
});

test("Consultas de GES sobre plazo de 48 horas", () => {
  const gesData = TRAMITE_EXAMPLES.ges;
  const respPlazo = responderConsultaHeuristica("¿En cuánto tiempo deben responder a mi reclamo?", gesData);
  assert(respPlazo.includes("48 horas"), "Debe indicar las 48 horas legales");
});

test("Consultas de Contribuciones sobre exención", () => {
  const contData = TRAMITE_EXAMPLES.contribuciones;
  const respDesc = responderConsultaHeuristica("¿Cuánto descuento me hacen en las contribuciones?", contData);
  assert(respDesc.includes("100%") || respDesc.includes("50%"), "Debe informar la rebaja del 100% o 50%");
});

console.log("\n=======================================================");
console.log(`📊 RESULTADO FINAL: ${passed} APROBADAS | ${failed} FALLIDAS`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 TODOS LOS TESTS DE LA TERCERA EDAD PASARON CON ÉXITO (100% PASS)\n");
}
