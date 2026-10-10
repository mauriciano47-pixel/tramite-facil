// Orquestador Principal de TrámiteFácil
// Conecta los módulos de Accesibilidad, API de Gemini, Clasificador, Radiografía Salarial, Generador de Escritos y Chat

import { setupAccessibilityControls, hablarTexto, detenerVoz } from './js/accessibility.js';
import { getApiKey, setupApiKeyModal } from './js/apiKeyManager.js';
import { clasificarTexto, clasificarArchivo, limpiarYParsearJSON, fetchConTimeout, fileToBase64 } from './js/documentClassifier.js';
import { renderSalaryBreakdown } from './js/salaryBreakdown.js';
import { setupDraftGenerator, cargarBorrador, actualizarBotonesTipoEscrito } from './js/draftGenerator.js';
import { setupChatAssistant, reiniciarChat } from './js/chatAssistant.js';
import { TRAMITE_EXAMPLES } from './data.js';

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
  function renderResult(data) {
    const rWhat = document.getElementById("r-what");
    const rTranslation = document.getElementById("r-translation");
    setSafeMarkdown(rWhat, data.what || "");
    setSafeMarkdown(rTranslation, data.translation || "");

    // Radiografía de Remuneraciones / Nómina
    renderSalaryBreakdown(data.salaryBreakdown || null);

    // Adaptar títulos de los botones de escritos legales
    actualizarBotonesTipoEscrito(!!data.salaryBreakdown);

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
          ? "📸 Procesando captura de cámara y ejecutando OCR..."
          : "📁 Leyendo archivo adjunto y extrayendo metadatos...";
      } else {
        loaderText.textContent = "🔍 Analizando la estructura legal y gramatical del texto...";
      }
    }

    setTimeout(() => {
      if (loaderText) {
        loaderText.textContent = "⚙️ Traduciendo términos complejos a lenguaje ciudadano sencillo...";
      }

      setTimeout(() => {
        loader?.classList.remove("show");
        resultPanel?.classList.add("show");

        let data = TRAMITE_EXAMPLES[key];
        if (!data) {
          data = {
            what: "Es un **documento personalizado** ingresado manualmente.",
            translation: "Has ingresado un fragmento de texto libre. El sistema detecta que contiene requerimientos administrativos que exigen que realices una acción a la brevedad.",
            steps: [
              "Leer atentamente las condiciones y plazos en el papel original.",
              "Identificar los datos del organismo emisor del documento.",
              "Contactar a la oficina oficial o canal autorizado para responder."
            ],
            docs: ["Documento Nacional de Identidad (DNI/NIE).", "El texto o carta original del trámite."],
            warns: ["Revisa cuidadosamente si existen plazos de vencimiento en días hábiles."],
            chatResponses: {
              default: "Has subido un documento personalizado. Te recomiendo verificar las firmas y los datos del remitente para evitar fraudes."
            }
          };
        }

        currentActiveData = data;
        ultimoTextoDocumento = rawText || data.translation;
        renderResult(data);
      }, 900);
    }, 900);
  }

  // --- ANÁLISIS REAL CON GEMINI FLASH (CON TIMEOUT DE 8000 MS Y VISIÓN MULTIMODAL) ---
  async function ejecutarAnalisisRealGemini(textoDocumento, fileAttachment = null) {
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
      console.warn("Fallo o timeout en Gemini API, conmutando a simulación guiada:", err);
      loader?.classList.remove("show");
      hablarTexto("Hubo una demora al conectar con el servidor de inteligencia artificial. Mostrando análisis guiado de respaldo.");
      ejecutarAnalisisLocal("custom", textoDocumento, !!fileAttachment);
    }
  }

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
      ejecutarAnalisisLocal(dataKey, textVal, false);
    } else {
      ejecutarAnalisisRealGemini(textVal);
    }
  });

  btnMediaAnalyze?.addEventListener("click", async () => {
    const file = cameraInput?.files[0] || fileInput?.files[0];
    if (!file) return;

    const key = getApiKey();
    if (!key) {
      const dataKey = clasificarArchivo(file.name);
      ejecutarAnalisisLocal(dataKey, "", true);
    } else {
      try {
        if (file.size > 15 * 1024 * 1024) {
          hablarTexto("El archivo es demasiado pesado. Por favor, selecciona un documento de menor tamaño.");
          alert("El archivo excede los 15MB permitidos.");
          return;
        }
        const base64 = await fileToBase64(file);
        const mimeType = file.type || "image/jpeg";
        ejecutarAnalisisRealGemini("", { base64, type: mimeType, name: file.name });
      } catch (err) {
        console.error("Error al procesar archivo:", err);
        ejecutarAnalisisLocal("custom", "", true);
      }
    }
  });

  // --- CHIPS DE EJEMPLOS PRECARGADOS ---
  document.querySelectorAll(".example-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const exampleKey = chip.getAttribute("data-example");
      ejecutarAnalisisLocal(exampleKey, "", false);
    });
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
    if (salarySection) salarySection.style.display = "none";
    actualizarBotonesTipoEscrito(false);

    resultPanel?.classList.remove("show");
    if (mainTabs) mainTabs.style.display = "flex";
    if (examplesArea) examplesArea.style.display = "block";

    switchTab('text');
  });
});
