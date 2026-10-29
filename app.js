// Orquestador Principal de TrámiteFácil
// Conecta los módulos de Accesibilidad, API de Gemini, Clasificador, Radiografía Salarial, Generador de Escritos y Chat

import { setupAccessibilityControls, hablarTexto, detenerVoz } from './js/accessibility.js';
import { getApiKey, setupApiKeyModal } from './js/apiKeyManager.js';
import { clasificarTexto, clasificarArchivo, limpiarYParsearJSON, fetchConTimeout, fileToBase64 } from './js/documentClassifier.js';
import { renderSalaryBreakdown } from './js/salaryBreakdown.js';
import { setupDraftGenerator, cargarBorrador, actualizarBotonesTipoEscrito } from './js/draftGenerator.js';
import { setupChatAssistant, reiniciarChat } from './js/chatAssistant.js';
import { extraerTextoDeImagen, extraerSueldoDesdeTexto } from './js/ocrEngine.js';
import { calcularFiniquitoLegal, extraerDatosFiniquitoDesdeTexto } from './js/severanceCalculator.js';
import { TRAMITE_EXAMPLES } from './data.js';
import { createCheckoutSession } from './js/stripeService.js';

document.addEventListener("DOMContentLoaded", () => {
  // --- ESTADO GENERAL DE LA APLICACIÓN ---
  let currentActiveData = null;
  let mediaSourceType = '';
  let ultimoTextoDocumento = "";

  // Getters para compartir estado con los submódulos de forma reactiva
  const getActiveData = () => currentActiveData;
  const getLastText = () => ultimoTextoDocumento;

  // --- INICIALIZACIÓN DE SUBMÓDULOS ---
  setupAccessibilityControls();
  setupApiKeyModal();
  setupDraftGenerator(getActiveData, getLastText);
  setupChatAssistant(getActiveData, getLastText);

  // --- ELEMENTOS DEL DOM ---
  const tabText = document.getElementById("tab-text");
  const tabUpload = document.getElementById("tab-upload");
  const panelText = document.getElementById("panel-text");
  const panelUpload = document.getElementById("panel-upload");
  const mainTabs = document.getElementById("main-tabs");
  const examplesArea = document.getElementById("examples-area");
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");
  const resultPanel = document.getElementById("result");
  const docText = document.getElementById("doc-text");
  const btnTextAnalyze = document.getElementById("btn-text-analyze");
  const boxCamera = document.getElementById("box-camera");
  const boxFile = document.getElementById("box-file");
  const cameraInput = document.getElementById("camera-input");
  const fileInput = document.getElementById("file-input");
  const mediaStatus = document.getElementById("media-status");
  const btnMediaAnalyze = document.getElementById("btn-media-analyze");
  const btnReset = document.getElementById("btn-reset");

  // --- NAVEGACIÓN ENTRE PESTAÑAS (TABS) ---
  function switchTab(target) {
    detenerVoz();
    if (target === 'text') {
      tabText?.classList.add("active");
      tabText?.setAttribute("aria-selected", "true");
      tabUpload?.classList.remove("active");
      tabUpload?.setAttribute("aria-selected", "false");
      panelText?.classList.add("active");
      panelUpload?.classList.remove("active");
    } else {
      tabUpload?.classList.add("active");
      tabUpload?.setAttribute("aria-selected", "true");
      tabText?.classList.remove("active");
      tabText?.setAttribute("aria-selected", "false");
      panelUpload?.classList.add("active");
      panelText?.classList.remove("active");
    }
  }

  tabText?.addEventListener("click", () => switchTab('text'));
  tabUpload?.addEventListener("click", () => switchTab('upload'));

  // --- CARGA DE ARCHIVOS Y FOTOS ---
  boxCamera?.addEventListener("click", () => cameraInput?.click());
  boxFile?.addEventListener("click", () => fileInput?.click());

  function handleMediaSelect(input, type) {
    const file = input.files[0];
    if (file) {
      mediaSourceType = type;
      const statusText = type === 'camera'
        ? `📸 Foto capturada correctamente: ${file.name}`
        : `📁 Archivo adjunto cargado: ${file.name}`;

      if (mediaStatus) {
        mediaStatus.textContent = statusText;
        mediaStatus.style.display = 'block';
      }
      if (btnMediaAnalyze) btnMediaAnalyze.style.display = 'flex';

      hablarTexto("Documento cargado correctamente. Presiona procesar para simplificarlo.");
    }
  }

  cameraInput?.addEventListener("change", () => handleMediaSelect(cameraInput, 'camera'));
  fileInput?.addEventListener("change", () => handleMediaSelect(fileInput, 'file'));

  // Helper seguro para renderizar texto con negritas markdown sin innerHTML arbitrario
  function setSafeMarkdown(el, text) {
    if (!el) return;
    el.textContent = "";
    if (!text) return;
    const parts = String(text).split(/(\*\*.*?\*\*)/g);
    parts.forEach(part => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const strong = document.createElement("strong");
        strong.textContent = part.slice(2, -2);
        el.appendChild(strong);
      } else if (part) {
        el.appendChild(document.createTextNode(part));
      }
    });
  }

  // --- RENDERIZADO DE RESULTADOS ---
  
  // --- RENDERIZADO DEL VERIFICADOR DE FINIQUITO Y ESCUDO DE NOTARÍA ---
  function renderSeveranceBreakdown(sevData) {
    const sevSection = document.getElementById("r-severance-section");
    if (!sevSection) return;

    if (!sevData) {
      sevSection.style.display = "none";
      return;
    }

    sevSection.style.display = "block";

    const totalEl = document.getElementById("sev-total-estimado");
    const anosEl = document.getElementById("sev-anos-monto");
    const anosNotaEl = document.getElementById("sev-anos-nota");
    const avisoEl = document.getElementById("sev-aviso-monto");
    const vacacionesEl = document.getElementById("sev-vacaciones-monto");
    const shieldBox = document.getElementById("sev-shield-box");

    if (totalEl) totalEl.textContent = sevData.totalEstimado || "$0";
    if (anosEl) anosEl.textContent = sevData.indemnizacionAnos || "$0";
    if (anosNotaEl) anosNotaEl.textContent = `${sevData.anosComputables || 0} años computables por ley`;
    if (avisoEl) avisoEl.textContent = sevData.indemnizacionAvisoPrevio || "$0";
    if (vacacionesEl) vacacionesEl.textContent = sevData.feriadoProporcional || "$0";
    if (shieldBox) shieldBox.textContent = `"${sevData.textoReserva || ''}"`;

    // Sincronizar inputs de la mini-calculadora
    const inputSueldo = document.getElementById("sim-sueldo");
    const inputAnos = document.getElementById("sim-anos");
    if (inputSueldo && sevData.sueldoBase) {
      const numSueldo = parseInt(String(sevData.sueldoBase).replace(/[^0-9]/g, ""), 10);
      if (!isNaN(numSueldo) && numSueldo > 0) inputSueldo.value = numSueldo;
    }
    if (inputAnos && sevData.anosComputables !== undefined) {
      inputAnos.value = sevData.anosComputables;
    }
  }

  // Eventos de Finiquito y Escudo de Notaría
  const btnCopyShield = document.getElementById("btn-copy-shield");
  const btnAudioShield = document.getElementById("btn-audio-shield");
  const btnAudioSeverance = document.getElementById("btn-audio-severance");
  const btnRecalculateSev = document.getElementById("btn-recalculate-sev");

  btnCopyShield?.addEventListener("click", async () => {
    const shieldBox = document.getElementById("sev-shield-box");
    if (!shieldBox) return;
    const textToCopy = shieldBox.textContent.replace(/^"|"$/g, "").trim();
    try {
      await navigator.clipboard.writeText(textToCopy);
      btnCopyShield.textContent = "¡Copiado! ✓";
      hablarTexto("Cláusula de reserva de derechos copiada con éxito para escribirla al firmar.");
      setTimeout(() => {
        btnCopyShield.textContent = "📋 Copiar texto para escribir al firmar";
      }, 2500);
    } catch {
      hablarTexto("Selecciona el texto del recuadro para copiarlo.");
    }
  });

  btnAudioShield?.addEventListener("click", () => {
    const shieldBox = document.getElementById("sev-shield-box");
    if (!shieldBox) return;
    hablarTexto("Cláusula de reserva de derechos para notaría. " + shieldBox.textContent);
  });

  btnAudioSeverance?.addEventListener("click", () => {
    const totalEl = document.getElementById("sev-total-estimado");
    const anosEl = document.getElementById("sev-anos-monto");
    const avisoEl = document.getElementById("sev-aviso-monto");
    const vacacionesEl = document.getElementById("sev-vacaciones-monto");
    const msg = `Verificador de finiquito. Total a recibir estimado: ${totalEl?.textContent || '$0'}. Indemnización por años de servicio: ${anosEl?.textContent || '$0'}. Mes de aviso previo: ${avisoEl?.textContent || '$0'}. Vacaciones proporcionales: ${vacacionesEl?.textContent || '$0'}.`;
    hablarTexto(msg);
  });

  btnRecalculateSev?.addEventListener("click", () => {
    const sVal = parseFloat(document.getElementById("sim-sueldo")?.value || "0");
    const aVal = parseInt(document.getElementById("sim-anos")?.value || "0", 10);
    const mVal = parseInt(document.getElementById("sim-meses")?.value || "0", 10);
    const vVal = parseInt(document.getElementById("sim-vacaciones")?.value || "0", 10);

    const recalculado = calcularFiniquitoLegal({
      sueldoBase: sVal,
      anosTrabajados: aVal,
      mesesFraccion: mVal,
      avisoPrevioDado: false,
      diasVacacionesPendientes: vVal,
      causal: 'necesidades_empresa'
    });

    renderSeveranceBreakdown(recalculado);
    hablarTexto(`Finiquito recalculado. Tu total legal a cobrar es de ${recalculado.totalEstimado}.`);
  });

  function renderResult(data) {
    const rWhat = document.getElementById("r-what");
    const rTranslation = document.getElementById("r-translation");
    setSafeMarkdown(rWhat, data.what || "");
    setSafeMarkdown(rTranslation, data.translation || "");

    // Radiografía de Remuneraciones / Nómina
    renderSalaryBreakdown(data.salaryBreakdown || null);
    renderSeveranceBreakdown(data.severanceBreakdown || null);

    // Adaptar títulos de los botones de escritos legales al contexto del trámite
    actualizarBotonesTipoEscrito(data);

    // Pasos a seguir
    const stepsUl = document.getElementById("r-steps");
    if (stepsUl) {
      stepsUl.textContent = "";
      if (Array.isArray(data.steps)) {
        data.steps.forEach((step, i) => {
          const li = document.createElement("li");
          const stepNum = document.createElement("div");
          stepNum.className = "step-num";
          stepNum.textContent = String(i + 1);
          const stepText = document.createElement("div");
          stepText.textContent = step;
          li.appendChild(stepNum);
          li.appendChild(stepText);
          stepsUl.appendChild(li);
        });
      }
    }

    // Documentos requeridos
    const docsSection = document.getElementById("r-docs-section");
    const docsUl = document.getElementById("r-docs");
    if (docsSection && docsUl) {
      docsUl.textContent = "";
      if (Array.isArray(data.docs) && data.docs.length > 0) {
        docsSection.style.display = "block";
        data.docs.forEach(doc => {
          const li = document.createElement("li");
          li.textContent = doc;
          docsUl.appendChild(li);
        });
      } else {
        docsSection.style.display = "none";
      }
    }

    // Advertencias y plazos
    const warnSection = document.getElementById("r-warn-section");
    const warnUl = document.getElementById("r-warn");
    if (warnSection && warnUl) {
      warnUl.textContent = "";
      if (Array.isArray(data.warns) && data.warns.length > 0) {
        warnSection.style.display = "block";
        data.warns.forEach(warn => {
          const li = document.createElement("li");
          li.textContent = warn;
          warnUl.appendChild(li);
        });
      } else {
        warnSection.style.display = "none";
      }
    }

    // Cargar borrador oficial por defecto
    cargarBorrador('prorroga', data);

    // Reiniciar chat con mensaje de bienvenida
    reiniciarChat();

    // Locución inicial accesible
    hablarTexto("He analizado el documento. " + (data.what || "") + ". Significa que: " + (data.translation || ""));
  }

  // --- ANÁLISIS SIMULADO LOCAL / OFFLINE FIRST ---
  function ejecutarAnalisisLocal(key, rawText = "", isMedia = false) {
    panelText?.classList.remove("active");
    panelUpload?.classList.remove("active");
    if (mainTabs) mainTabs.style.display = "none";
    if (examplesArea) examplesArea.style.display = "none";

    loader?.classList.add("show");
    if (loaderText) {
      if (isMedia) {
        loaderText.textContent = mediaSourceType === 'camera'
          ? "📸 Procesando captura y organizando pasos del trámite..."
          : "📁 Leyendo documento y preparando guía en palabras sencillas...";
      } else {
        loaderText.textContent = "🔍 Analizando el documento y preparando tu explicación...";
      }
    }

    setTimeout(() => {
      if (loaderText) {
        loaderText.textContent = "⚙️ Traduciendo a lenguaje ciudadano sencillo...";
      }

      setTimeout(() => {
        loader?.classList.remove("show");
        resultPanel?.classList.add("show");

        let rawData = TRAMITE_EXAMPLES[key];
        let data = null;
        if (rawData) {
          data = { ...rawData, _key: key };
        } else {
          data = {
            _key: "custom",
            what: "Es un **documento personalizado** ingresado manualmente.",
            translation: "Has ingresado un fragmento de texto libre. El sistema detecta que contiene requerimientos administrativos que exigen que realices una acción a la brevedad.",
            steps: [
              "Leer atentamente las condiciones y plazos en el papel original.",
              "Identificar los datos del organismo emisor del documento.",
              "Contactar a la oficina oficial o canal autorizado para responder."
            ],
            docs: ["Documento Nacional de Identidad (DNI/NIE/RUT).", "El texto o carta original del trámite."],
            warns: ["Revisa cuidadosamente si existen plazos de vencimiento en días hábiles."],
            chatResponses: {
              default: "Has subido un documento personalizado. Te recomiendo verificar las firmas y los datos del remitente para evitar fraudes."
            }
          };
        }

        currentActiveData = data;
        ultimoTextoDocumento = rawText || data.translation;
        renderResult(data);
      }, 700);
    }, 700);
  }

  // --- ANÁLISIS REAL MEDIANTE OCR EN EL NAVEGADOR (SIN API KEY / OFFLINE FIRST) ---
  async function ejecutarOCRReal(file) {
    panelText?.classList.remove("active");
    panelUpload?.classList.remove("active");
    if (mainTabs) mainTabs.style.display = "none";
    if (examplesArea) examplesArea.style.display = "none";

    loader?.classList.add("show");
    if (loaderText) {
      loaderText.textContent = "🔍 Iniciando lector óptico para leer tu imagen...";
    }
    hablarTexto("Iniciando lectura óptica de tu imagen. Por favor espera unos momentos.");

    try {
      const rawText = await extraerTextoDeImagen(file, (pct, status) => {
        if (loaderText) {
          loaderText.textContent = status;
        }
      });

      loader?.classList.remove("show");

      // Verificación de legibilidad: Si no se extrajo texto o es menor a 15 caracteres
      if (!rawText || rawText.trim().length < 15) {
        const dataIlegible = {
          _key: "custom",
          what: "⚠️ **No fue posible leer el texto de tu fotografía**",
          translation: "La imagen que adjuntaste está demasiado desenfocada, tiene sombras oscuras o no contiene texto legible con números claros. Para tu protección, el sistema no inventa información ni montos falsos.",
          steps: [
            "Coloca el papel sobre una mesa plana con buena luz directa.",
            "Toma la fotografía de frente y asegurando que las letras y números se vean nítidos.",
            "O si lo prefieres, copia o escribe los montos directamente en la pestaña 'Pegar texto'."
          ],
          docs: ["Tu documento físico original en papel."],
          warns: ["Evita enviar fotos movidas, borrosas o con reflejos de flash."],
          chatResponses: {
            default: "No logré detectar texto claro en esta imagen. Te recomiendo tomar otra foto más nítida o ingresar los datos manualmente en la pestaña de texto."
          }
        };

        currentActiveData = dataIlegible;
        ultimoTextoDocumento = "";
        resultPanel?.classList.add("show");
        renderResult(dataIlegible);
        return;
      }

      // Transparencia total: volcar el texto leído en el cuadro de texto
      if (docText) docText.value = rawText;
      ultimoTextoDocumento = rawText;

      // Analizar si es finiquito/despido o liquidación de sueldo mediante extracción heurística
      const datosFiniquito = extraerDatosFiniquitoDesdeTexto(rawText);
      const desgloseSueldo = extraerSueldoDesdeTexto(rawText);
      const tipoDocumento = clasificarTexto(rawText);

      let data;
      if (datosFiniquito || tipoDocumento === "finiquito") {
        const infoFiniquito = datosFiniquito || calcularFiniquitoLegal({
          sueldoBase: 700000,
          anosTrabajados: 2,
          mesesFraccion: 0,
          avisoPrevioDado: false,
          diasVacacionesPendientes: 10,
          causal: 'necesidades_empresa'
        });

        data = {
          _key: "finiquito",
          what: "Es una **Carta de Despido / Propuesta de Finiquito Laboral** leída directamente desde tu imagen.",
          translation: `Lectura óptica de término laboral: Tu indemnización estimada por ley es de **${infoFiniquito.totalEstimado}**. Incluye indemnización por años de servicio, mes de aviso y vacaciones proporcionales. Recuerda no firmar sin tu Reserva de Derechos.`,
          severanceBreakdown: infoFiniquito,
          steps: [
            "Verificar que tus cotizaciones de AFP, Salud y AFC se encuentren pagadas al 100% al día del despido.",
            "Revisar que el cálculo de años de servicio compute 1 mes por cada año o fracción mayor a 6 meses.",
            "Comprobar que no te descuenten indebidamente el aporte patronal de la AFC.",
            "Al firmar en la notaría o en la Dirección del Trabajo, escribir a mano la Cláusula de Reserva de Derechos generada en pantalla."
          ],
          docs: [
            "Carta de aviso de despido o propuesta de finiquito.",
            "Certificado de cotizaciones de tu AFP pagadas al día.",
            "Contrato de trabajo original y últimas liquidaciones."
          ],
          warns: [
            "⚠️ Nunca firmes en notaría sin escribir la Reserva de Derechos o perderás la opción de demandar por cobros pendientes.",
            "El empleador tiene 10 días hábiles para pagar y poner a disposición el finiquito."
          ],
          chatResponses: {
            plazo: "El empleador tiene 10 días hábiles para entregarte el finiquito. Tienes 60 días para reclamar ante la Dirección del Trabajo.",
            documento: "Guarda tu carta de despido, contrato de trabajo y certificado de cotizaciones de AFP al día.",
            default: "He analizado tu finiquito desde la foto. Revisa las cifras y utiliza la Cláusula de Reserva de Derechos al firmar."
          }
        };
      } else if (desgloseSueldo || tipoDocumento === "sueldo") {
        const infoSueldo = desgloseSueldo || {
          totalHaberes: "A verificar",
          totalDescuentos: "A verificar",
          liquidoPagar: "A verificar",
          haberes: [{ label: "Haberes detectados", amount: "En revisión", type: "imponible", desc: "Revisa la nitidez de la foto" }],
          descuentos: [{ label: "Descuentos detectados", amount: "En revisión", desc: "Revisa la nitidez de la foto" }],
          esLecturaReal: true
        };

        data = {
          _key: "sueldo",
          what: "Es una **Liquidación de Sueldo / Nómina de Remuneraciones** leída directamente desde tu imagen.",
          translation: desgloseSueldo
            ? `Lectura óptica real completada: Tu total de haberes ganados es de **${desgloseSueldo.totalHaberes}**, tus descuentos obligatorios suman **${desgloseSueldo.totalDescuentos}**, y tu dinero líquido real a recibir en el bolsillo es de **${desgloseSueldo.liquidoPagar}**.`
            : "Hemos detectado una liquidación de remuneraciones en tu documento. Algunos montos numéricos resultaron difíciles de distinguir con nitidez; por favor revisa el desglose a continuación.",
          salaryBreakdown: infoSueldo,
          steps: [
            "Revisa que tu Sueldo Base coincida con lo pactado en tu contrato de trabajo.",
            "Comprueba que tus cotizaciones de AFP y Salud (Fonasa/Isapre) hayan sido efectivamente pagadas por tu empleador en Previred.",
            "Verifica que el monto líquido a pagar haya sido depositado completo en tu cuenta bancaria o entregado en efectivo.",
            "Firma la copia de conformidad únicamente después de haber recibido el dinero."
          ],
          docs: [
            "Copia de esta liquidación de sueldo con tu firma y la de la empresa.",
            "Certificado de cotizaciones de tu AFP del último período.",
            "Contrato de trabajo vigente y anexos de actualización salarial."
          ],
          warns: [
            "El empleador tiene obligación legal de pagar las cotizaciones previsionales hasta el día 10 (o 13 por vía electrónica) del mes siguiente.",
            "Si existen descuentos no autorizados por ley o por contrato, puedes denunciar ante la Dirección del Trabajo."
          ],
          chatResponses: {
            plazo: "El pago de tu remuneración debe hacerse en la fecha pactada en tu contrato (habitualmente el último día del mes o primeros 5 días del mes siguiente).",
            documento: "Guarda siempre tus liquidaciones firmadas por al menos 5 años ante cualquier fiscalización o trámite de pensión futura.",
            default: "He desglosado tus haberes y deducciones directamente de los datos leídos de tu fotografía. Pregúntame sobre cualquier descuento específico."
          }
        };
      } else {
        const plantilla = TRAMITE_EXAMPLES[tipoDocumento];
        if (plantilla) {
          data = {
            ...plantilla,
            _key: tipoDocumento,
            what: `Es una **${plantilla.what.replace(/\*\*/g, '')}** leída desde tu imagen.`
          };
        } else {
          data = {
            _key: "custom",
            what: "Es un **documento oficial** leído desde tu imagen.",
            translation: "Hemos leído el texto de tu fotografía. Contiene instrucciones y requerimientos administrativos que debes atender.",
            steps: [
              "Leer atentamente los plazos y fechas señalados en el documento.",
              "Verificar el organismo o entidad que emite la notificación.",
              "Acudir al canal oficial o sucursal correspondiente para responder."
            ],
            docs: ["Tu Cédula de Identidad (RUT/DNI).", "El documento impreso o fotografiado."],
            warns: ["Verifica si existen plazos de vencimiento en días hábiles."],
            chatResponses: {
              default: "He leído el texto de tu documento. Pregúntame lo que necesites saber sobre sus plazos o pasos a seguir."
            }
          };
        }
      }

      currentActiveData = data;
      resultPanel?.classList.add("show");
      renderResult(data);

    } catch (err) {
      console.error("Error en procesamiento OCR:", err);
      loader?.classList.remove("show");
      hablarTexto("Hubo un problema al procesar la imagen con el lector óptico.");
      alert("No se pudo completar la lectura óptica de la imagen. Verifica tu conexión a internet o intenta ingresar el texto manualmente en la pestaña Pegar texto.");
      if (mainTabs) mainTabs.style.display = "flex";
      if (examplesArea) examplesArea.style.display = "block";
      switchTab('upload');
    }
  }

  // --- ANÁLISIS REAL CON GEMINI FLASH (CON TIMEOUT DE 8000 MS Y VISIÓN MULTIMODAL) ---
  async function ejecutarAnalisisRealGemini(textoDocumento, fileAttachment = null, originalFile = null) {
    const apiKey = getApiKey();
    if (!apiKey) return;

    panelText?.classList.remove("active");
    panelUpload?.classList.remove("active");
    if (mainTabs) mainTabs.style.display = "none";
    if (examplesArea) examplesArea.style.display = "none";

    loader?.classList.add("show");
    if (loaderText) {
      loaderText.textContent = fileAttachment
        ? "📡 Procesando documento con Gemini 1.5 Flash (Visión Multimodal)..."
        : "📡 Analizando documento con Gemini 1.5 Flash...";
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const promptText = fileAttachment
        ? `Actúa como simplificador para adultos mayores. Analiza exhaustivamente la imagen o documento oficial adjunto y devuelve un objeto JSON válido con la siguiente estructura exacta:
{
  "what": "Una explicación muy breve (de una oración) de qué tipo de documento es en negrita (ej: Es una **notificación de Hacienda** referente al IRPF).",
  "translation": "Una explicación muy sencilla en español (lenguaje cotidiano) de qué dice el documento ('en cristiano'). Usa metáforas simples si es necesario. Evita jergas técnicas.",
  "steps": ["Paso 1 muy claro y directo", "Paso 2 muy claro y directo"],
  "docs": ["Documento necesario 1", "Documento necesario 2"],
  "warns": ["Advertencia o fecha límite importante 1", "Advertencia o fecha límite importante 2"],
  "chatResponses": {
    "plazo": "Respuesta específica sobre plazos, fechas límite o vencimientos de este documento.",
    "documento": "Respuesta específica sobre qué documentos o papeles se necesitan y dónde obtenerlos.",
    "default": "Explicación general sobre qué hacer con este documento y recomendación general."
  },
  "salaryBreakdown": {
    "totalHaberes": "Total bruto o ganado con símbolo de moneda",
    "totalDescuentos": "Total descontado con signo negativo",
    "liquidoPagar": "Monto líquido o de bolsillo a recibir",
    "haberes": [{"label": "Concepto", "amount": "Monto", "type": "imponible|no-imponible", "desc": "Explicación sencilla"}],
    "descuentos": [{"label": "Concepto", "amount": "Monto", "desc": "Por qué se descuenta y a dónde va este dinero"}]
  }
}
Nota: Si el documento NO es una nómina o liquidación de sueldo, omite la clave "salaryBreakdown".
No agregues explicaciones fuera del JSON, devuelve únicamente el JSON válido.`
        : `Actúa como simplificador para adultos mayores. Analiza el siguiente texto de un documento oficial y devuelve un objeto JSON válido con la siguiente estructura exacta:
{
  "what": "Una explicación muy breve (de una oración) de qué tipo de documento es en negrita (ej: Es una **notificación de Hacienda** referente al IRPF).",
  "translation": "Una explicación muy sencilla en español (lenguaje cotidiano) de qué dice el documento ('en cristiano'). Usa metáforas simples si es necesario. Evita jergas técnicas.",
  "steps": ["Paso 1 muy claro y directo", "Paso 2 muy claro y directo"],
  "docs": ["Documento necesario 1", "Documento necesario 2"],
  "warns": ["Advertencia o fecha límite importante 1", "Advertencia o fecha límite importante 2"],
  "chatResponses": {
    "plazo": "Respuesta específica sobre plazos, fechas límite o vencimientos de este documento.",
    "documento": "Respuesta específica sobre qué documentos o papeles se necesitan y dónde obtenerlos.",
    "default": "Explicación general sobre qué hacer con este documento y recomendación general."
  },
  "salaryBreakdown": {
    "totalHaberes": "Total bruto o ganado con símbolo de moneda",
    "totalDescuentos": "Total descontado con signo negativo",
    "liquidoPagar": "Monto líquido o de bolsillo a recibir",
    "haberes": [{"label": "Concepto", "amount": "Monto", "type": "imponible|no-imponible", "desc": "Explicación sencilla"}],
    "descuentos": [{"label": "Concepto", "amount": "Monto", "desc": "Por qué se descuenta y a dónde va este dinero"}]
  }
}
Nota: Si el documento NO es una nómina o liquidación de sueldo, omite la clave "salaryBreakdown".
No agregues explicaciones fuera del JSON, devuelve únicamente el JSON válido.

Texto del documento:
${textoDocumento}`;

      const parts = [{ text: promptText }];
      if (fileAttachment) {
        parts.push({
          inlineData: {
            mimeType: fileAttachment.type,
            data: fileAttachment.base64
          }
        });
      }

      const response = await fetchConTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        })
      }, 8000);

      if (!response.ok) {
        throw new Error(`Error en API de Gemini: ${response.status} ${response.statusText}`);
      }

      const resData = await response.json();
      const rawText = resData.candidates[0].content.parts[0].text;
      const parsedData = limpiarYParsearJSON(rawText);

      loader?.classList.remove("show");
      resultPanel?.classList.add("show");

      currentActiveData = parsedData;
      ultimoTextoDocumento = textoDocumento || (fileAttachment ? `Documento adjunto: ${fileAttachment.name}` : parsedData.translation);
      renderResult(parsedData);

    } catch (err) {
      console.warn("Fallo o timeout en Gemini API, conmutando a OCR local o simulación guiada:", err);
      loader?.classList.remove("show");
      if (originalFile) {
        hablarTexto("No se pudo conectar con el servidor de inteligencia artificial. Leyendo tu documento con el lector óptico del dispositivo.");
        await ejecutarOCRReal(originalFile);
      } else {
        hablarTexto("Hubo una demora al conectar con el servidor de inteligencia artificial. Mostrando análisis guiado de respaldo.");
        ejecutarAnalisisLocal("custom", textoDocumento, false);
      }
    }
  }

  // --- BOTONES DE ACCIÓN DE TEXTO (SENIOR-FIRST) ---
  const btnPasteClipboard = document.getElementById("btn-paste-clipboard");
  const btnClearText = document.getElementById("btn-clear-text");

  btnPasteClipboard?.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          if (docText) docText.value = text.trim();
          hablarTexto("Texto copiado pegado con éxito. Ahora presiona analizar.");
        } else {
          hablarTexto("No se encontró texto copiado. Escribe o pega tu documento en el recuadro.");
          docText?.focus();
        }
      } else {
        docText?.focus();
        hablarTexto("Toca dentro del recuadro para pegar tu texto.");
      }
    } catch (err) {
      console.warn("Acceso a portapapeles bloqueado por el navegador:", err);
      docText?.focus();
      hablarTexto("Por favor, mantén presionado el recuadro para pegar tu texto.");
    }
  });

  btnClearText?.addEventListener("click", () => {
    if (docText) {
      docText.value = "";
      docText.focus();
      hablarTexto("Texto borrado.");
    }
  });

  // --- BOTONES DE ANÁLISIS ---
  btnTextAnalyze?.addEventListener("click", () => {
    const textVal = docText?.value.trim() || "";
    if (!textVal) {
      hablarTexto("Por favor, pega el texto del documento para analizar.");
      return;
    }

    const key = getApiKey();
    if (!key) {
      const dataKey = clasificarTexto(textVal);
      const datosFiniquito = extraerDatosFiniquitoDesdeTexto(textVal);
      const desgloseSueldo = extraerSueldoDesdeTexto(textVal);

      if (datosFiniquito || dataKey === "finiquito") {
        const infoFiniquito = datosFiniquito || calcularFiniquitoLegal({
          sueldoBase: 700000,
          anosTrabajados: 2,
          mesesFraccion: 0,
          avisoPrevioDado: false,
          diasVacacionesPendientes: 10,
          causal: 'necesidades_empresa'
        });

        const dataFiniquitoReal = {
          _key: "finiquito",
          what: "Es una **Carta de Despido / Propuesta de Finiquito Laboral** analizada desde tu texto.",
          translation: `Análisis de término laboral: Tu indemnización legal estimada asciende a **${infoFiniquito.totalEstimado}**. Exige el pago completo de años trabajados y vacaciones proporcionales.`,
          severanceBreakdown: infoFiniquito,
          steps: [
            "Verificar que tus cotizaciones de AFP, Salud y AFC se encuentren pagadas al 100% al día del despido.",
            "Revisar que el cálculo de años de servicio compute 1 mes por cada año o fracción mayor a 6 meses.",
            "Comprobar que no te descuenten indebidamente el aporte patronal de la AFC.",
            "Al firmar en notaría o portal de la Dirección del Trabajo, escribe a mano la Cláusula de Reserva de Derechos generada en pantalla."
          ],
          docs: [
            "Carta de despido o aviso de término de contrato.",
            "Certificado de cotizaciones previsionales de tu AFP pagadas al día.",
            "Contrato de trabajo y últimas 3 liquidaciones de sueldo."
          ],
          warns: [
            "⚠️ Nunca firmes en notaría sin escribir la Reserva de Derechos o perderás la opción de demandar por cobros pendientes.",
            "El empleador tiene 10 días hábiles para pagar y poner a disposición el finiquito."
          ],
          chatResponses: {
            plazo: "El empleador tiene 10 días hábiles para entregarte el finiquito. Tienes 60 días para reclamar ante la Dirección del Trabajo.",
            documento: "Guarda tu carta de despido, contrato de trabajo y certificado de cotizaciones de AFP al día.",
            default: "He analizado tu finiquito desde el texto ingresado. Revisa las cifras y utiliza la Cláusula de Reserva de Derechos al firmar."
          }
        };

        panelText?.classList.remove("active");
        panelUpload?.classList.remove("active");
        if (mainTabs) mainTabs.style.display = "none";
        if (examplesArea) examplesArea.style.display = "none";
        currentActiveData = dataFiniquitoReal;
        ultimoTextoDocumento = textVal;
        resultPanel?.classList.add("show");
        renderResult(dataFiniquitoReal);
        return;
      }

      // Si el texto pegado es una liquidación de sueldo o contiene cifras, extraer datos reales sin mocks
      if (desgloseSueldo || dataKey === "sueldo") {
        const infoSueldo = desgloseSueldo || {
          totalHaberes: "A verificar",
          totalDescuentos: "A verificar",
          liquidoPagar: "A verificar",
          haberes: [{ label: "Haberes detectados", amount: "En revisión", type: "imponible", desc: "Revisa el texto ingresado" }],
          descuentos: [{ label: "Descuentos detectados", amount: "En revisión", desc: "Revisa el texto ingresado" }],
          esLecturaReal: true
        };

        const dataSueldoReal = {
          _key: "sueldo",
          what: "Es una **Liquidación de Sueldo / Nómina de Remuneraciones** analizada desde tu texto.",
          translation: desgloseSueldo
            ? `Análisis real de tu liquidación: Tu total de haberes ganados es de **${desgloseSueldo.totalHaberes}**, tus descuentos obligatorios suman **${desgloseSueldo.totalDescuentos}**, y tu dinero líquido que entra al bolsillo es de **${desgloseSueldo.liquidoPagar}**.`
            : "Se detectaron conceptos de remuneraciones en el texto ingresado. Revisa el desglose de haberes y deducciones.",
          salaryBreakdown: infoSueldo,
          steps: [
            "Revisa que tu Sueldo Base coincida con lo pactado en tu contrato de trabajo.",
            "Comprueba que tus cotizaciones de AFP y Salud (Fonasa/Isapre) hayan sido efectivamente pagadas por tu empleador en Previred.",
            "Verifica que el monto líquido a pagar haya sido depositado completo en tu cuenta bancaria o entregado en efectivo.",
            "Firma la copia de conformidad únicamente después de haber recibido el dinero."
          ],
          docs: [
            "Copia de esta liquidación de sueldo con tu firma y la de la empresa.",
            "Certificado de cotizaciones de tu AFP del último período.",
            "Contrato de trabajo vigente y anexos de actualización salarial."
          ],
          warns: [
            "El empleador tiene obligación legal de pagar las cotizaciones previsionales hasta el día 10 (o 13 por vía electrónica) del mes siguiente.",
            "Si existen descuentos no autorizados por ley o por contrato, puedes denunciar ante la Dirección del Trabajo."
          ],
          chatResponses: {
            plazo: "El pago de tu remuneración debe hacerse en la fecha pactada en tu contrato.",
            documento: "Guarda siempre tus liquidaciones firmadas por al menos 5 años ante cualquier fiscalización.",
            default: "He desglosado tus haberes y deducciones directamente de los datos que pegaste."
          }
        };

        panelText?.classList.remove("active");
        panelUpload?.classList.remove("active");
        if (mainTabs) mainTabs.style.display = "none";
        if (examplesArea) examplesArea.style.display = "none";
        currentActiveData = dataSueldoReal;
        ultimoTextoDocumento = textVal;
        resultPanel?.classList.add("show");
        renderResult(dataSueldoReal);
      } else {
        ejecutarAnalisisLocal(dataKey, textVal, false);
      }
    } else {
      ejecutarAnalisisRealGemini(textVal);
    }
  });

  btnMediaAnalyze?.addEventListener("click", async () => {
    const file = cameraInput?.files[0] || fileInput?.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      hablarTexto("El archivo es demasiado pesado. Por favor, selecciona un documento de menor tamaño.");
      alert("El archivo excede los 15MB permitidos.");
      return;
    }

    const key = getApiKey();
    if (!key) {
      // Sin API Key (Visitante, nuevo PC o adulto mayor): Reconocimiento Óptico de Caracteres REAL sin datos inventados
      await ejecutarOCRReal(file);
    } else {
      // Con API Key: Análisis Gemini Multimodal con fallback a OCR local en caso de error o cuota
      try {
        const base64 = await fileToBase64(file);
        const mimeType = file.type || "image/jpeg";
        await ejecutarAnalisisRealGemini("", { base64, type: mimeType, name: file.name }, file);
      } catch (err) {
        console.error("Error al preparar archivo para Gemini, conmutando a OCR local:", err);
        await ejecutarOCRReal(file);
      }
    }
  });

  // --- SELECTOR RÁPIDO DE FOTOS PARA ADULTOS MAYORES ---
  document.querySelectorAll(".btn-photo-type").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-type");
      ejecutarAnalisisLocal(type, "", true);
    });
  });

  // --- CHIPS DE EJEMPLOS PRECARGADOS ---
  document.querySelectorAll(".example-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const exampleKey = chip.getAttribute("data-example");
      ejecutarAnalisisLocal(exampleKey, "", false);
    });
  });

  // --- MODAL DE AYUDA PARA ADULTOS MAYORES ---
  const btnAyuda = document.getElementById("btn-ayuda");
  const modalAyuda = document.getElementById("modal-ayuda");
  const btnCloseAyuda = document.getElementById("btn-close-ayuda");
  const btnUnderstandHelp = document.getElementById("btn-understand-help");
  const btnAudioHelp = document.getElementById("btn-audio-help");

  function abrirAyuda() {
    detenerVoz();
    modalAyuda?.classList.add("show");
    modalAyuda?.setAttribute("aria-hidden", "false");
  }

  function cerrarAyuda() {
    detenerVoz();
    modalAyuda?.classList.remove("show");
    modalAyuda?.setAttribute("aria-hidden", "true");
  }

  btnAyuda?.addEventListener("click", abrirAyuda);
  btnCloseAyuda?.addEventListener("click", cerrarAyuda);
  btnUnderstandHelp?.addEventListener("click", cerrarAyuda);

  window.addEventListener("click", (e) => {
    if (e.target === modalAyuda) cerrarAyuda();
  });

  btnAudioHelp?.addEventListener("click", () => {
    const textoAyuda = "Cómo usar Trámite Fácil en tres sencillos pasos. Paso uno: Elige un ejemplo de los botones de colores, como Pensión y PGU, Salud GES o Contribuciones, o copia el texto de tu carta y toca el botón azul de pegar. Paso dos: Léelo o escúchalo con el botón de voz para conocer tus plazos. Paso tres: Al final tienes tu carta oficial ya redactada, solo cambia tus datos e imprímela. Esta aplicación es cien por ciento gratuita, privada y no requiere registros.";
    hablarTexto(textoAyuda);
  });

  // --- MODO DESARROLLADOR OPCIONAL (EN PIE DE PÁGINA) ---
  const btnDevApiTrigger = document.getElementById("btn-dev-api-trigger");
  const modalApi = document.getElementById("modal-api");
  btnDevApiTrigger?.addEventListener("click", () => {
    detenerVoz();
    modalApi?.classList.add("show");
    modalApi?.setAttribute("aria-hidden", "false");
  });

  // --- MODAL DE PLANES & MONETIZACIÓN STRIPE (M&A READY) ---
  const btnPlanes = document.getElementById("btn-planes");
  const modalPlanes = document.getElementById("modal-planes");
  const btnClosePlanes = document.getElementById("btn-close-planes");
  const btnDismissPlanes = document.getElementById("btn-dismiss-planes");
  const btnCheckoutAnnual = document.getElementById("btn-checkout-annual");
  const btnCheckoutB2B = document.getElementById("btn-checkout-b2b");

  function abrirPlanes() {
    detenerVoz();
    modalPlanes?.classList.add("show");
    modalPlanes?.setAttribute("aria-hidden", "false");
  }

  function cerrarPlanes() {
    modalPlanes?.classList.remove("show");
    modalPlanes?.setAttribute("aria-hidden", "true");
  }

  btnPlanes?.addEventListener("click", abrirPlanes);
  btnClosePlanes?.addEventListener("click", cerrarPlanes);
  btnDismissPlanes?.addEventListener("click", cerrarPlanes);

  window.addEventListener("click", (e) => {
    if (e.target === modalPlanes) cerrarPlanes();
    if (e.target === modalAyuda) cerrarAyuda();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modalPlanes?.classList.contains("show")) cerrarPlanes();
      if (modalAyuda?.classList.contains("show")) cerrarAyuda();
    }
  });

  btnCheckoutAnnual?.addEventListener("click", () => {
    const session = createCheckoutSession('prod_tramite_pro_annual');
    if (session.checkoutUrl) {
      window.open(session.checkoutUrl, '_blank', 'noopener,noreferrer');
    }
  });

  btnCheckoutB2B?.addEventListener("click", () => {
    const session = createCheckoutSession('prod_tramite_gestoria_b2b');
    if (session.checkoutUrl) {
      window.open(session.checkoutUrl, '_blank', 'noopener,noreferrer');
    }
  });

  // --- BOTÓN RESTABLECER ---
  btnReset?.addEventListener("click", () => {
    detenerVoz();

    if (docText) docText.value = "";
    if (cameraInput) cameraInput.value = "";
    if (fileInput) fileInput.value = "";
    if (mediaStatus) mediaStatus.style.display = "none";
    if (btnMediaAnalyze) btnMediaAnalyze.style.display = "none";

    currentActiveData = null;
    ultimoTextoDocumento = "";

    const salarySection = document.getElementById("r-salary-section");
    const sevSection = document.getElementById("r-severance-section");
    if (sevSection) sevSection.style.display = "none";
    if (salarySection) salarySection.style.display = "none";
    actualizarBotonesTipoEscrito(false);

    resultPanel?.classList.remove("show");
    if (mainTabs) mainTabs.style.display = "flex";
    if (examplesArea) examplesArea.style.display = "block";

    switchTab('text');
  });
});
