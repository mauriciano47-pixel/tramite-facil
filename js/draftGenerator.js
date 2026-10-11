// Módulo de Generación y Redacción de Escritos Legales Oficiales para TrámiteFácil
import { hablarTexto, detenerVoz } from './accessibility.js';
import { getApiKey } from './apiKeyManager.js';
import { fetchConTimeout } from './documentClassifier.js';

export const plantillasGenericasPorDefecto = {
  prorroga: `AL ORGANISMO EMISOR / ADMINISTRACIÓN PÚBLICA COMPETENTE
DIRECCIÓN / SEDE: [INDICAR ORGANISMO O SEDE]

DATOS DE LA PERSONA INTERESADA:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [TU DNI O NIE]
Domicilio a efectos de notificaciones: [TU DIRECCIÓN COMPLETA]
Teléfono de contacto: [TU TELÉFONO]
Correo electrónico: [TU CORREO ELECTRÓNICO]

NÚMERO DE EXPEDIENTE / REFERENCIA: [INDICAR NÚMERO DE EXPEDIENTE O CÓDIGO DE LA CARTA]

ASUNTO: Solicitud de ampliación de plazo / prórroga administrativa

EXPONE:
1. Que con fecha [FECHA DE NOTIFICACIÓN], he recibido notificación relativa al expediente de referencia, en el cual se me concede un plazo para realizar las actuaciones requeridas.
2. Que concurren circunstancias justificadas de dificultad técnica y material para recabar la totalidad de la documentación requerida dentro del plazo originariamente concedido, sin que dicha demora perjudique derechos de terceros ni el interés general.
3. Que de conformidad con el artículo 32 de la Ley 39/2015 del Procedimiento Administrativo Común, procede la concesión de una ampliación del plazo por un periodo que no exceda de la mitad del mismo.

SOLICITA:
Que se sirva admitir el presente escrito y conceder la ampliación del plazo legalmente prevista para cumplimentar adecuadamente el trámite conferido.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

  justificantes: `AL ORGANISMO EMISOR / ADMINISTRACIÓN PÚBLICA COMPETENTE
DIRECCIÓN / SEDE: [INDICAR ORGANISMO O SEDE]

DATOS DE LA PERSONA INTERESADA:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [TU DNI O NIE]
Domicilio: [TU DIRECCIÓN COMPLETA]
Teléfono: [TU TELÉFONO]

EXPEDIENTE / REFERENCIA: [NÚMERO DE EXPEDIENTE]

ASUNTO: Aportación de documentos y justificantes en plazo legal

EXPONE:
1. Que en atención al requerimiento administrativo recibido en relación al expediente arriba referenciado, comparezco en tiempo y forma a fin de aportar los documentos solicitados.
2. Que a tal efecto se adjunta la siguiente relación de justificantes y comprobantes:
   - Documento Nº 1: [DETALLAR DOCUMENTO O RECIBO 1]
   - Documento Nº 2: [DETALLAR DOCUMENTO O RECIBO 2]
   - Documento Nº 3: [DETALLAR OTRO JUSTIFICANTE, SI CORRESPONDE]

SOLICITA:
Que se tengan por aportados los documentos indicados, teniéndose por cumplimentado el requerimiento en todos sus términos y archivándose el trámite con resolución favorable.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

  descargo: `AL ORGANISMO EMISOR / ADMINISTRACIÓN PÚBLICA COMPETENTE
DIRECCIÓN / SEDE: [INDICAR ORGANISMO O SEDE]

DATOS DE LA PERSONA INTERESADA:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [TU DNI O NIE]
Domicilio: [TU DIRECCIÓN COMPLETA]
Teléfono: [TU TELÉFONO]

EXPEDIENTE / REFERENCIA: [NÚMERO DE EXPEDIENTE O SANCIÓN]

ASUNTO: Escrito de alegaciones, descargo y disconformidad motivada

EXPONE:
1. Que mediante el presente escrito formulo formal disconformidad con la notificación recibida, por no ajustarse a los hechos reales acontecidos ni a la legalidad vigente.
2. Que la actuación imputada o liquidación practicada resulta improcedente en base a las siguientes razones y consideraciones:
   - Primera: [EXPONER DE FORMA CLARA Y RESPETUOSA EL PRIMER MOTIVO]
   - Segunda: [EXPONER EL SEGUNDO MOTIVO O PRUEBA QUE LO DESMIENTE]
3. Que se acompaña al presente escrito la prueba documental acreditativa de lo manifestado.

SOLICITA:
Que se tengan por formuladas las presentes alegaciones, procediéndose a la revisión y estimación de las mismas, dejando sin efecto la propuesta desfavorable contenida en la notificación.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`
};

let currentDraftType = 'prorroga';

/**
 * Obtiene el texto de un borrador sustituyendo variables dinámicas
 * @param {string} tipo 
 * @param {object} [activeData] 
 * @returns {string}
 */
export function obtenerTextoBorrador(tipo = 'prorroga', activeData = null) {
  let plantilla = "";

  if (activeData && activeData.draftTemplates && activeData.draftTemplates[tipo]) {
    plantilla = activeData.draftTemplates[tipo];
  } else if (plantillasGenericasPorDefecto[tipo]) {
    plantilla = plantillasGenericasPorDefecto[tipo];
  } else {
    plantilla = plantillasGenericasPorDefecto.prorroga;
  }

  const hoy = new Date();
  const fechaTexto = hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  return plantilla.replace(/\[FECHA ACTUAL\]/g, fechaTexto);
}

function renderButtonMarkup(btn, icon, title, desc, ariaLabel) {
  if (!btn) return;
  btn.textContent = "";
  const iconSpan = document.createElement("span");
  iconSpan.className = "type-icon";
  iconSpan.setAttribute("aria-hidden", "true");
  iconSpan.textContent = icon;

  const infoDiv = document.createElement("div");
  infoDiv.className = "type-info";
  const strongEl = document.createElement("strong");
  strongEl.textContent = title;
  const smallEl = document.createElement("small");
  smallEl.textContent = desc;
  infoDiv.appendChild(strongEl);
  infoDiv.appendChild(smallEl);

  btn.appendChild(iconSpan);
  btn.appendChild(infoDiv);
  btn.setAttribute("aria-label", ariaLabel);
}

/**
 * Actualiza la apariencia y accesibilidad de los 3 botones de selección de tipo de escrito
 * @param {string | boolean | object} context Identificador de trámite o booleano de sueldo
 */
export function actualizarBotonesTipoEscrito(context) {
  if (typeof document === 'undefined') return;

  const btnProrroga = document.getElementById("btn-type-prorroga");
  const btnJustificantes = document.getElementById("btn-type-justificantes");
  const btnDescargo = document.getElementById("btn-type-descargo");

  let tipo = "general";
  if (typeof context === "string") {
    tipo = context;
  } else if (context === true) {
    tipo = "sueldo";
  } else if (context && typeof context === "object") {
    if (context.salaryBreakdown) tipo = "sueldo";
    else if (context._key) tipo = context._key;
    else if (context.what) {
      const w = context.what.toLowerCase();
      if (w.includes("pgu") || w.includes("pensión") || w.includes("pension")) tipo = "pgu";
      else if (w.includes("ges") || w.includes("auge") || w.includes("salud")) tipo = "ges";
      else if (w.includes("contribución") || w.includes("contribucion") || w.includes("territorial")) tipo = "contribuciones";
      else if (w.includes("poder") || w.includes("mandato")) tipo = "poder";
    }
  }

  if (tipo === "sueldo") {
    renderButtonMarkup(btnProrroga, "📝", "Aclaración de Sueldo", "Pedir informe de cálculos a RRHH", "Seleccionar escrito de Solicitud de Aclaración de Sueldo");
    renderButtonMarkup(btnJustificantes, "📑", "Acreditar Cargas / Asignación", "Entregar certificados de asignaciones", "Seleccionar escrito de Acreditación de Cargas y Asignaciones");
    renderButtonMarkup(btnDescargo, "⚖️", "Reclamo Descuento Indebido", "Exigir restitución de montos no autorizados", "Seleccionar escrito de Reclamo por Descuento Indebido");
  } else if (tipo === "pgu") {
    renderButtonMarkup(btnProrroga, "👵", "Reconsideración PGU", "Solicitar revisión por ingresos familiares", "Seleccionar escrito de Reconsideración de PGU");
    renderButtonMarkup(btnJustificantes, "🏠", "Acreditar Residencia", "Demostrar permanencia en el país", "Seleccionar escrito de Acreditación de Residencia");
    renderButtonMarkup(btnDescargo, "⚖️", "Reclamo Suspensión Pensión", "Exigir pago retroactivo inmediato", "Seleccionar escrito de Reclamo por Suspensión de Pensión");
  } else if (tipo === "ges") {
    renderButtonMarkup(btnProrroga, "🏥", "Reclamo Segundo Prestador", "Exigir clínica privada en 48 horas", "Seleccionar escrito de Segundo Prestador GES");
    renderButtonMarkup(btnJustificantes, "💊", "Urgencia Medicamentos GES", "Solicitar entrega inmediata de fármacos", "Seleccionar escrito de Entrega Urgente de Medicamentos");
    renderButtonMarkup(btnDescargo, "⚖️", "Reclamo Superintendencia", "Denunciar abandono de tratamiento", "Seleccionar escrito de Reclamo ante Superintendencia de Salud");
  } else if (tipo === "contribuciones") {
    renderButtonMarkup(btnProrroga, "🏠", "Rebaja Adulto Mayor (SII)", "Solicitar exención del 100% o 50%", "Seleccionar escrito de Rebaja de Contribuciones para Adulto Mayor");
    renderButtonMarkup(btnJustificantes, "📑", "Suspensión Cobranza (TGR)", "Frenar cobro coactivo e intereses", "Seleccionar escrito de Suspensión de Cobranza ante Tesorería");
    renderButtonMarkup(btnDescargo, "⚖️", "Rectificar Avalúo Fiscal", "Corregir avalúo por casa económica", "Seleccionar escrito de Rectificación de Avalúo Fiscal");
  } else if (tipo === "poder") {
    renderButtonMarkup(btnProrroga, "👵", "Poder Cobro de Pensión", "Autorizar a familiar en banco/caja", "Seleccionar Poder para Cobro de Pensión");
    renderButtonMarkup(btnJustificantes, "💊", "Poder Retiro Medicamentos", "Autorizar trámites en Cesfam/Hospital", "Seleccionar Autorización para Retiro de Medicamentos");
    renderButtonMarkup(btnDescargo, "✍️", "Poder Simple General", "Para luz, agua o trámites del municipio", "Seleccionar Poder Simple General");
  } else {
    renderButtonMarkup(btnProrroga, "⏳", "Solicitud de Prórroga", "Pedir más tiempo para reunir documentos", "Seleccionar escrito de Solicitud de Prórroga");
    renderButtonMarkup(btnJustificantes, "📄", "Aportar Documentación", "Entregar recibos o facturas requeridas", "Seleccionar escrito de Aportación de Justificantes");
    renderButtonMarkup(btnDescargo, "⚖️", "Alegaciones / Descargo", "Manifestar disconformidad con respeto", "Seleccionar escrito de Alegaciones y Descargo");
  }
}

/**
 * Carga un borrador en el área de texto de edición
 * @param {string} tipo 
 * @param {object} [activeData] 
 */
export function cargarBorrador(tipo = 'prorroga', activeData = null) {
  if (typeof document === 'undefined') return;
  currentDraftType = tipo;

  const draftTextarea = document.getElementById("draft-textarea");
  const draftStatusMsg = document.getElementById("draft-status-msg");

  // Actualizar estado activo en los botones de tipo
  document.querySelectorAll('.btn-response-type').forEach(btn => {
    const bType = btn.getAttribute('data-type');
    if (bType === currentDraftType) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });

  const texto = obtenerTextoBorrador(tipo, activeData);
  if (draftTextarea) draftTextarea.value = texto;

  if (draftStatusMsg) {
    if (activeData && activeData.draftTemplates && activeData.draftTemplates[tipo]) {
      draftStatusMsg.textContent = "Borrador cargado. Modifica tus datos entre corchetes antes de imprimir.";
    } else {
      draftStatusMsg.textContent = "Plantilla estándar adaptada. Completa los datos entre corchetes.";
    }
  }
}

/**
 * Inicializa todos los eventos de interacción del generador de escritos
 * @param {() => object} getActiveDataFn 
 * @param {() => string} getLastTextFn 
 */
export function setupDraftGenerator(getActiveDataFn, getLastTextFn) {
  if (typeof document === 'undefined') return;

  const draftTextarea = document.getElementById("draft-textarea");
  const draftStatusMsg = document.getElementById("draft-status-msg");
  const btnCopyDraft = document.getElementById("btn-copy-draft");
  const txtCopyDraft = document.getElementById("txt-copy-draft");
  const btnPrintDraft = document.getElementById("btn-print-draft");
  const btnRegenerateDraft = document.getElementById("btn-regenerate-draft");

  // Botones de selección de tipo
  document.querySelectorAll('.btn-response-type').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.getAttribute('data-type');
      const activeData = getActiveDataFn();
      cargarBorrador(tipo, activeData);

      const nombresTipos = (activeData && activeData.salaryBreakdown)
        ? {
            prorroga: "Solicitud de aclaración de sueldo",
            justificantes: "Acreditación de cargas familiares y asignaciones",
            descargo: "Reclamo formal por descuento indebido"
          }
        : {
            prorroga: "Solicitud de prórroga",
            justificantes: "Aportación de documentación",
            descargo: "Alegaciones y descargo"
          };
      hablarTexto(`Borrador cambiado a ${nombresTipos[tipo] || tipo}. Puedes editar el texto en pantalla.`);
    });
  });

  // Copiar al portapapeles
  if (btnCopyDraft) {
    btnCopyDraft.addEventListener('click', async () => {
      if (!draftTextarea || !draftTextarea.value.trim()) return;
      try {
        await navigator.clipboard.writeText(draftTextarea.value);
        if (txtCopyDraft) txtCopyDraft.textContent = "¡Copiado! ✓";
        hablarTexto("Escrito copiado al portapapeles con éxito.");
        setTimeout(() => {
          if (txtCopyDraft) txtCopyDraft.textContent = "Copiar Escrito";
        }, 2500);
      } catch (err) {
        draftTextarea.select();
        document.execCommand('copy');
        if (txtCopyDraft) txtCopyDraft.textContent = "¡Copiado! ✓";
        hablarTexto("Escrito copiado al portapapeles.");
        setTimeout(() => {
          if (txtCopyDraft) txtCopyDraft.textContent = "Copiar Escrito";
        }, 2500);
      }
    });
  }

  // Imprimir
  if (btnPrintDraft) {
    btnPrintDraft.addEventListener('click', () => {
      if (!draftTextarea || !draftTextarea.value.trim()) {
        hablarTexto("No hay texto para imprimir.");
        return;
      }
      hablarTexto("Abriendo ventana de impresión del folio oficial.");
      window.print();
    });
  }

  // Regenerar con Gemini
  if (btnRegenerateDraft) {
    btnRegenerateDraft.addEventListener('click', async () => {
      const apiKey = getApiKey();
      detenerVoz();
      const activeData = getActiveDataFn();
      const lastText = getLastTextFn();

      if (!apiKey) {
        cargarBorrador(currentDraftType, activeData);
        hablarTexto("Plantilla oficial restaurada a su formato original.");
        return;
      }

      const btnSpan = btnRegenerateDraft.querySelector('span');
      const textoOriginalBtn = btnSpan ? btnSpan.textContent : "Regenerar con IA";
      btnRegenerateDraft.disabled = true;
      if (btnSpan) btnSpan.textContent = "Redactando...";
      if (draftStatusMsg) draftStatusMsg.textContent = "⏳ Gemini está redactando un escrito formal personalizado...";

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const prompt = `Actúa como un abogado administrativo y funcionario público experto en redacción formal y transparente para ciudadanos y adultos mayores.
Redacta un escrito administrativo oficial formal, impecable y respetuoso en español para presentar ante un organismo público oficial.

Contexto del documento analizado:
${lastText || (activeData ? activeData.translation : "Documento administrativo")}

Tipo de escrito solicitado: ${currentDraftType} (prórroga de plazo, aportación de justificantes requeridos, o alegaciones de descargo).

Estructura obligatoria del escrito (formato folio de texto plano):
1. ENCABEZADO: Órgano o Autoridad Administrativa a quien se dirige.
2. DATOS DEL INTERESADO/A: Nombre, DNI/NIE, Domicilio, Teléfono con marcadores entre corchetes [COMO ESTE] para que el ciudadano los complete.
3. EXPEDIENTE / REFERENCIA: Marcador [NÚMERO DE EXPEDIENTE].
4. ASUNTO: Título formal claro del trámite.
5. HECHOS ('EXPONE'): Explicación clara, educada y cronológica de la situación en 2-3 puntos numerados.
6. FUNDAMENTACIÓN O JUSTIFICACIÓN: Breve fundamento en derecho administrativo.
7. PETICIÓN FORMAL ('SOLICITA'): Lo que se pide de forma concreta y precisa.
8. LUGAR Y FECHA: "En [CIUDAD], a ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}."
9. ESPACIO PARA FIRMA Y NOMBRE COMPLETO.

IMPORTANTE: Devuelve ÚNICAMENTE el texto formal del escrito listo para imprimir. NO incluyas introducciones ni explicaciones antes o después. NO uses asteriscos de markdown ni símbolos decorativos.`;

        const response = await fetchConTimeout(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 }
          })
        }, 8000);

        if (!response.ok) throw new Error(`Error en API: ${response.status}`);

        const resData = await response.json();
        const textoGenerado = resData.candidates[0].content.parts[0].text.trim();

        if (draftTextarea) draftTextarea.value = textoGenerado;
        if (draftStatusMsg) draftStatusMsg.textContent = "✨ Escrito personalizado redactado por Gemini 1.5 Flash. Revisa y completa los datos entre corchetes.";
        hablarTexto("El escrito oficial ha sido redactado con inteligencia artificial. Está listo para que completes tus datos.");

      } catch (err) {
        console.warn("Error o timeout en regeneración de borrador con Gemini:", err);
        cargarBorrador(currentDraftType, activeData);
        if (draftStatusMsg) draftStatusMsg.textContent = "Restaurada plantilla oficial estándar debido a un retraso en la red.";
        hablarTexto("Hubo una demora con el servidor. Se ha cargado la plantilla oficial estándar de respaldo.");
      } finally {
        btnRegenerateDraft.disabled = false;
        if (btnSpan) btnSpan.textContent = textoOriginalBtn;
      }
    });
  }
}
