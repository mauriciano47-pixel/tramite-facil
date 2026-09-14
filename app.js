// Lógica Interactiva y Conexión de API para Trámite Fácil

document.addEventListener("DOMContentLoaded", () => {
  // --- VARIABLES DE ESTADO ---
  let baseFontSize = 16; // Fuente base por defecto en px
  let lectorVozActivo = false;
  let vozEspañol = null;
  let currentActiveData = null; // Guarda los datos del documento actual (estructura what, translation, steps...)
  let mediaSourceType = ''; // 'camera' o 'file'
  let chatHistory = []; // Historial de chat para la sesión de análisis activa
  let ultimoTextoDocumento = ""; // Guarda el texto original completo analizado

  // --- CONFIGURACIÓN DE VOZ DE SÍNTESIS (Text-to-Speech) ---
  function cargarVoces() {
    if ('speechSynthesis' in window) {
      const voces = window.speechSynthesis.getVoices();
      vozEspañol = voces.find(v => v.lang.startsWith('es-')) || voces.find(v => v.lang.startsWith('es'));
    }
  }

  cargarVoces();
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = cargarVoces;
  }

  function detenerVoz() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function hablarTexto(texto) {
    if (!('speechSynthesis' in window)) return;
    detenerVoz();
    if (!texto) return;

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      // Limpiar marcadores markdown básicos
      const textoLimpio = texto.replace(/\*\*/g, '').replace(/_/g, '').replace(/###/g, '');

      const mensaje = new SpeechSynthesisUtterance(textoLimpio);
      if (vozEspañol) {
        mensaje.voice = vozEspañol;
      }
      mensaje.rate = 0.85; // Velocidad cómoda y pausada
      mensaje.pitch = 1;
      mensaje.onerror = () => { /* Silencioso ante cancelaciones rápidas */ };
      window.speechSynthesis.speak(mensaje);
    } catch (e) {
      console.warn("Audio speech synthesis no disponible:", e);
    }
  }

  // --- ADMINISTRACIÓN DE API KEY DE GEMINI ---
  const btnConfigApi = document.getElementById("btn-config-api");
  const modalApi = document.getElementById("modal-api");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const inputApiKey = document.getElementById("input-api-key");
  const btnSaveApi = document.getElementById("btn-save-api");
  const btnDeleteApi = document.getElementById("btn-delete-api");
  const apiStatusDot = document.getElementById("api-status-dot");

  function getApiKey() {
    return localStorage.getItem("gemini_api_key") || "";
  }

  function actualizarIndicadorApi() {
    const key = getApiKey();
    if (key) {
      apiStatusDot.className = "status-dot connected";
      btnConfigApi.title = "API de Gemini activa e integrada";
    } else {
      apiStatusDot.className = "status-dot disconnected";
      btnConfigApi.title = "Configurar clave API de Gemini (modo simulación activo)";
    }
  }

  // Inicializar indicador
  actualizarIndicadorApi();

  // Abrir Modal
  btnConfigApi.addEventListener("click", () => {
    detenerVoz();
    inputApiKey.value = getApiKey();
    modalApi.classList.add("show");
    modalApi.setAttribute("aria-hidden", "false");
    inputApiKey.focus();
  });

  // Cerrar Modal
  function cerrarModalApi() {
    modalApi.classList.remove("show");
    modalApi.setAttribute("aria-hidden", "true");
  }

  btnCloseModal.addEventListener("click", cerrarModalApi);
  window.addEventListener("click", (e) => {
    if (e.target === modalApi) {
      cerrarModalApi();
    }
  });

  // Guardar API Key
  btnSaveApi.addEventListener("click", () => {
    const key = inputApiKey.value.trim();
    if (key) {
      localStorage.setItem("gemini_api_key", key);
      actualizarIndicadorApi();
      cerrarModalApi();
      hablarTexto("Clave de API configurada y guardada correctamente.");
    } else {
      hablarTexto("Por favor, ingresa una clave válida.");
    }
  });

  // Eliminar API Key
  btnDeleteApi.addEventListener("click", () => {
    localStorage.removeItem("gemini_api_key");
    inputApiKey.value = "";
    actualizarIndicadorApi();
    cerrarModalApi();
    hablarTexto("Clave de API eliminada. Se activó el modo de simulación.");
  });

  // --- CONTROLES DE ACCESIBILIDAD ---
  const btnDisminuirLetra = document.getElementById("btn-disminuir-letra");
  const btnRestaurarLetra = document.getElementById("btn-restaurar-letra");
  const btnAumentarLetra = document.getElementById("btn-aumentar-letra");
  const btnAltoContraste = document.getElementById("btn-alto-contraste");
  const btnLectorVoz = document.getElementById("btn-lector-voz");
  const txtLectorVoz = document.getElementById("txt-lector-voz");

  // Ajustes de letra
  btnAumentarLetra.addEventListener("click", () => {
    if (baseFontSize < 26) {
      baseFontSize += 2;
      document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'px');
    }
  });

  btnDisminuirLetra.addEventListener("click", () => {
    if (baseFontSize > 12) {
      baseFontSize -= 2;
      document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'px');
    }
  });

  btnRestaurarLetra.addEventListener("click", () => {
    baseFontSize = 16;
    document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'px');
  });

  // Tema de Contraste
  btnAltoContraste.addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
    const esContraste = document.body.classList.contains("high-contrast");
    btnAltoContraste.setAttribute("aria-label", esContraste ? "Desactivar alto contraste" : "Activar alto contraste");
  });

  // Lector de voz interactivo al pasar / hacer clic
  btnLectorVoz.addEventListener("click", () => {
    lectorVozActivo = !lectorVozActivo;
    if (lectorVozActivo) {
      document.body.classList.add("voz-activa");
      txtLectorVoz.textContent = "Voz Activada";
      btnLectorVoz.setAttribute("aria-label", "Desactivar lector de voz interactivo");
      hablarTexto("Lector de voz activado. Haz clic en los textos que deseas escuchar en voz alta.");
    } else {
      document.body.classList.remove("voz-activa");
      txtLectorVoz.textContent = "Voz Desactivada";
      btnLectorVoz.setAttribute("aria-label", "Activar lector de voz interactivo");
      detenerVoz();
    }
  });

  document.body.addEventListener("click", (e) => {
    if (!lectorVozActivo) return;
    
    const elemento = e.target;
    // Evitar leer controles de cabecera y chat inputs
    if (elemento.closest('header') || elemento.closest('.tabs') || elemento.closest('.chat-input-row') || elemento.closest('.modal') || elemento.tagName === 'BUTTON' || elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
      return;
    }

    const etiquetasLeibles = ['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'SPAN', 'DIV'];
    if (etiquetasLeibles.includes(elemento.tagName) && elemento.textContent.trim()) {
      hablarTexto(elemento.textContent || elemento.innerText);
    }
  });

  // --- CONTROLES DE PESTAÑAS (TABS) ---
  const tabText = document.getElementById("tab-text");
  const tabUpload = document.getElementById("tab-upload");
  const panelText = document.getElementById("panel-text");
  const panelUpload = document.getElementById("panel-upload");

  function switchTab(target) {
    detenerVoz();
    if (target === 'text') {
      tabText.classList.add("active");
      tabText.setAttribute("aria-selected", "true");
      tabUpload.classList.remove("active");
      tabUpload.setAttribute("aria-selected", "false");
      
      panelText.classList.add("active");
      panelUpload.classList.remove("active");
    } else {
      tabUpload.classList.add("active");
      tabUpload.setAttribute("aria-selected", "true");
      tabText.classList.remove("active");
      tabText.setAttribute("aria-selected", "false");
      
      panelUpload.classList.add("active");
      panelText.classList.remove("active");
    }
  }

  tabText.addEventListener("click", () => switchTab('text'));
  tabUpload.addEventListener("click", () => switchTab('upload'));

  // --- ADMINISTRADOR DE ARCHIVOS ---
  const boxCamera = document.getElementById("box-camera");
  const boxFile = document.getElementById("box-file");
  const cameraInput = document.getElementById("camera-input");
  const fileInput = document.getElementById("file-input");
  const mediaStatus = document.getElementById("media-status");
  const btnMediaAnalyze = document.getElementById("btn-media-analyze");

  boxCamera.addEventListener("click", () => cameraInput.click());
  boxFile.addEventListener("click", () => fileInput.click());

  function handleMediaSelect(input, type) {
    const file = input.files[0];
    if (file) {
      mediaSourceType = type;
      const statusText = type === 'camera'
        ? `📸 Foto capturada correctamente: ${file.name}`
        : `📁 Archivo adjunto cargado: ${file.name}`;
      
      mediaStatus.textContent = statusText;
      mediaStatus.style.display = 'block';
      btnMediaAnalyze.style.display = 'flex';
      
      hablarTexto("Documento cargado correctamente. Presiona procesar para simplificarlo.");
    }
  }

  cameraInput.addEventListener("change", () => handleMediaSelect(cameraInput, 'camera'));
  fileInput.addEventListener("change", () => handleMediaSelect(fileInput, 'file'));

  // --- EJECUCIÓN DEL ANÁLISIS (SIMULACIÓN O REAL) ---
  const btnTextAnalyze = document.getElementById("btn-text-analyze");
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");
  const resultPanel = document.getElementById("result");
  const examplesArea = document.getElementById("examples-area");
  const mainTabs = document.getElementById("main-tabs");
  const docText = document.getElementById("doc-text");

  // Botón analizar texto pegado
  btnTextAnalyze.addEventListener("click", () => {
    const textVal = docText.value.trim();
    if (!textVal) {
      hablarTexto("Por favor, pega el texto del documento para analizar.");
      return;
    }
    
    // Si no hay API Key, buscar coincidencia en ejemplos simulados
    const key = getApiKey();
    if (!key) {
      let dataKey = "custom";
      const textLower = textVal.toLowerCase();
      
      if (textLower.includes("hacienda") || textLower.includes("irpf") || textLower.includes("impuesto")) {
        dataKey = "hacienda";
      } else if (textLower.includes("multa") || textLower.includes("velocidad") || textLower.includes("radar") || textLower.includes("tráfico")) {
        dataKey = "multa";
      } else if (textLower.includes("juez") || textLower.includes("juzgado") || textLower.includes("tribunal") || textLower.includes("citación") || textLower.includes("demanda")) {
        dataKey = "juzgado";
      }
      ejecutarAnalisisLocal(dataKey, textVal, false);
    } else {
      ejecutarAnalisisRealGemini(textVal);
    }
  });

  // Utilidad de Timeout para llamadas de API (Protocolo Anti-Timeout: 8000ms)
  async function fetchConTimeout(url, options = {}, timeoutMs = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  // Convertir archivo a base64 para multimodalidad de Gemini
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // Limpieza robusta de JSON retornado por Gemini
  function limpiarYParsearJSON(rawText) {
    let clean = rawText.trim();
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json\s*/i, "");
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\s*/, "");
    }
    if (clean.endsWith("```")) {
      clean = clean.replace(/```\s*$/, "");
    }
    return JSON.parse(clean.trim());
  }

  // Botón analizar adjunto
  btnMediaAnalyze.addEventListener("click", async () => {
    const file = cameraInput.files[0] || fileInput.files[0];
    if (!file) return;
    const key = getApiKey();
    
    if (!key) {
      // Modo simulación local guiada
      let dataKey = "custom";
      const nameLower = file.name.toLowerCase();
      if (nameLower.includes("hacienda") || nameLower.includes("renta") || nameLower.includes("impuesto")) {
        dataKey = "hacienda";
      } else if (nameLower.includes("multa") || nameLower.includes("velocidad") || nameLower.includes("transito")) {
        dataKey = "multa";
      } else if (nameLower.includes("citacion") || nameLower.includes("juzgado") || nameLower.includes("demanda")) {
        dataKey = "juzgado";
      }
      ejecutarAnalisisLocal(dataKey, "", true);
    } else {
      // Con API Key: Visión multimodal real con Gemini 1.5 Flash
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

  // Cargar chips ejemplos
  const chips = document.querySelectorAll(".example-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const exampleKey = chip.getAttribute("data-example");
      // Siempre usamos simulación local para los ejemplos precargados
      ejecutarAnalisisLocal(exampleKey, "", false);
    });
  });

  // --- ANALISIS SIMULADO LOCAL ---
  function ejecutarAnalisisLocal(key, rawText = "", isMedia = false) {
    panelText.classList.remove("active");
    panelUpload.classList.remove("active");
    mainTabs.style.display = "none";
    examplesArea.style.display = "none";

    loader.classList.add("show");
    
    if (isMedia) {
      loaderText.textContent = mediaSourceType === 'camera'
        ? "📸 Procesando captura de cámara y ejecutando OCR..."
        : "📁 Leyendo archivo adjunto y extrayendo metadatos...";
    } else {
      loaderText.textContent = "🔍 Analizando la estructura legal y gramatical del texto...";
    }

    setTimeout(() => {
      loaderText.textContent = "⚙️ Traduciendo términos complejos a lenguaje ciudadano sencillo...";
      
      setTimeout(() => {
        loader.classList.remove("show");
        resultPanel.classList.add("show");
        
        let data = window.TRAMITE_EXAMPLES[key];
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
        chatHistory = [];
        renderResult(data);

      }, 1000);
    }, 1000);
  }

  // --- ANALISIS REAL CON LA API DE GEMINI (CON ANTI-TIMEOUT Y MULTIMODALIDAD) ---
  async function ejecutarAnalisisRealGemini(textoDocumento, fileAttachment = null) {
    const apiKey = getApiKey();
    if (!apiKey) return;

    panelText.classList.remove("active");
    panelUpload.classList.remove("active");
    mainTabs.style.display = "none";
    examplesArea.style.display = "none";

    loader.classList.add("show");
    loaderText.textContent = fileAttachment
      ? "📡 Procesando documento con Gemini 1.5 Flash (Visión Multimodal)..."
      : "📡 Analizando documento con Gemini 1.5 Flash...";

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const systemInstruction = "Actúa como un simplificador y traductor de lenguaje burocrático, legal y técnico oficial en español, diseñado especialmente para adultos mayores. Tu labor es analizar el documento o texto que te proporcione el usuario y explicarlo de manera extremadamente sencilla, clara, directa y empática.";
      
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
  }
}
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
  }
}
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

      // Llamada con timeout de 8000ms según norma de protocolo
      const response = await fetchConTimeout(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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
      
      // Parsear la respuesta estructurada de Gemini limpiando posibles markdown blocks
      const parsedData = limpiarYParsearJSON(rawText);

      loader.classList.remove("show");
      resultPanel.classList.add("show");

      currentActiveData = parsedData;
      ultimoTextoDocumento = textoDocumento || (fileAttachment ? `Documento adjunto: ${fileAttachment.name}` : parsedData.translation);
      chatHistory = [];
      
      renderResult(parsedData);

    } catch (err) {
      console.warn("Fallo o timeout en Gemini API, alternando a simulación guiada:", err);
      loader.classList.remove("show");
      // Notificación de voz empática y fallback inmediato
      hablarTexto("Hubo una demora al conectar con el servidor de inteligencia artificial. Mostrando análisis guiado de respaldo.");
      
      // Ejecutar simulación local de respaldo sin interrumpir la experiencia
      ejecutarAnalisisLocal("custom", textoDocumento, !!fileAttachment);
    }
  }

  // Renderizar resultados en pantalla
  function renderResult(data) {
    document.getElementById("r-what").innerHTML = data.what;
    document.getElementById("r-translation").innerHTML = data.translation;

    // Pasos
    const stepsUl = document.getElementById("r-steps");
    stepsUl.innerHTML = "";
    data.steps.forEach((step, i) => {
      stepsUl.innerHTML += `<li><div class="step-num">${i + 1}</div><div>${step}</div></li>`;
    });

    // Documentos
    const docsSection = document.getElementById("r-docs-section");
    const docsUl = document.getElementById("r-docs");
    docsUl.innerHTML = "";
    if (data.docs && data.docs.length > 0) {
      docsSection.style.display = "block";
      data.docs.forEach(doc => {
        docsUl.innerHTML += `<li>${doc}</li>`;
      });
    } else {
      docsSection.style.display = "none";
    }

    // Advertencias
    const warnSection = document.getElementById("r-warn-section");
    const warnUl = document.getElementById("r-warn");
    warnUl.innerHTML = "";
    if (data.warns && data.warns.length > 0) {
      warnSection.style.display = "block";
      data.warns.forEach(warn => {
        warnUl.innerHTML += `<li>${warn}</li>`;
      });
    } else {
      warnSection.style.display = "none";
    }

    // Inicializar chat
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = `
      <div class="msg msg-ai">Hola, he analizado la carga del documento. ¿Qué parte te gustaría que te explique más a fondo?</div>
    `;

    // Lectura de síntesis de voz inicial
    hablarTexto("He analizado el documento. " + data.what + ". Significa que: " + data.translation);
  }

  // --- BOTONES DE AUDIO POR SECCIÓN ---
  // Hacemos que sea un listener delegado para soportar re-renderizados
  document.body.addEventListener("click", (e) => {
    const audioBtn = e.target.closest('.btn-audio-section');
    if (!audioBtn) return;
    
    e.stopPropagation();
    const targetId = audioBtn.getAttribute("data-target");
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      if (targetElement.tagName === 'UL') {
        const items = Array.from(targetElement.querySelectorAll('li')).map((li, idx) => {
          return `Punto ${idx + 1}: ${li.innerText || li.textContent}`;
        }).join(". ");
        hablarTexto(items);
      } else {
        hablarTexto(targetElement.textContent || targetElement.innerText);
      }
    }
  });

  // --- CHAT INTERACTIVO (SIMULADO O CON IA REAL) ---
  const chatInput = document.getElementById("chat-input");
  const btnChatSend = document.getElementById("btn-chat-send");
  const chatMessages = document.getElementById("chat-messages");

  async function enviarMensajeChat() {
    const query = chatInput.value.trim();
    if (!query) return;

    // Renderizar mensaje del usuario
    chatMessages.innerHTML += `<div class="msg msg-user">${query}</div>`;
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    detenerVoz();

    const apiKey = getApiKey();
    if (!apiKey) {
      // --- RESPUESTA SIMULADA ---
      setTimeout(() => {
        let responseText = "";
        const queryLower = query.toLowerCase();
        
        if (currentActiveData && currentActiveData.chatResponses) {
          if (queryLower.includes("plazo") || queryLower.includes("cuando") || queryLower.includes("fecha") || queryLower.includes("limite") || queryLower.includes("tiempo")) {
            responseText = currentActiveData.chatResponses.plazo || currentActiveData.chatResponses.default;
          } else if (queryLower.includes("documento") || queryLower.includes("papel") || queryLower.includes("requisito") || queryLower.includes("que llevar")) {
            responseText = currentActiveData.chatResponses.documento || currentActiveData.chatResponses.default;
          } else if (queryLower.includes("descuento") || queryLower.includes("pagar") || queryLower.includes("dinero") || queryLower.includes("multa")) {
            responseText = currentActiveData.chatResponses.descuento || currentActiveData.chatResponses.default;
          } else if (queryLower.includes("abogado") || queryLower.includes("defensa") || queryLower.includes("juicio") || queryLower.includes("juez")) {
            responseText = currentActiveData.chatResponses.abogado || currentActiveData.chatResponses.default;
          } else if (queryLower.includes("inasistencia") || queryLower.includes("no ir") || queryLower.includes("faltar")) {
            responseText = currentActiveData.chatResponses.inasistencia || currentActiveData.chatResponses.default;
          } else {
            responseText = currentActiveData.chatResponses.default;
          }
        } else {
          responseText = "Esto significa que debes realizar la acción indicada dentro de los días hábiles que estipula el papel para evitar multas.";
        }

        chatMessages.innerHTML += `<div class="msg msg-ai">${responseText}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        hablarTexto(responseText);
      }, 800);
      
    } else {
      // --- RESPUESTA REAL CON GEMINI ---
      chatMessages.innerHTML += `<div class="msg msg-ai" id="chat-loading-bubble">Pensando...</div>`;
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const historialPrompt = chatHistory.map(h => `${h.role}: ${h.text}`).join("\n");
        const prompt = `Eres un asistente empático y sencillo que ayuda a adultos mayores a entender el siguiente documento oficial.

Texto del documento:
${ultimoTextoDocumento}

Historial de conversación anterior:
${historialPrompt}

Pregunta del usuario:
${query}

Responde de manera muy clara, directa y en español de forma comprensible para una persona mayor. Evita términos legales complicados y sé muy empático. Tu respuesta debe tener máximo 3 oraciones cortas y resolver la duda de forma simple. No incluyas código ni caracteres especiales.`;

        const response = await fetchConTimeout(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.3
            }
          })
        }, 8000);

        if (!response.ok) throw new Error(`Error en el chat: ${response.status}`);

        const resData = await response.json();
        const responseText = resData.candidates[0].content.parts[0].text.trim();

        // Eliminar burbuja de carga
        const loadingBubble = document.getElementById("chat-loading-bubble");
        if (loadingBubble) loadingBubble.remove();

        chatMessages.innerHTML += `<div class="msg msg-ai">${responseText}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Guardar en el historial
        chatHistory.push({ role: "usuario", text: query });
        chatHistory.push({ role: "asistente", text: responseText });

        hablarTexto(responseText);

      } catch (err) {
        console.warn("Fallo o timeout en chat Gemini, activando fallback local:", err);
        const loadingBubble = document.getElementById("chat-loading-bubble");
        if (loadingBubble) loadingBubble.remove();
        
        let fallbackText = "No te preocupes: para este tipo de trámite es importante que revises bien las fechas límite en el papel y acudas a la oficina oficial o con un asesor de confianza.";
        if (currentActiveData && currentActiveData.chatResponses && currentActiveData.chatResponses.default) {
          fallbackText = currentActiveData.chatResponses.default;
        }
        
        chatMessages.innerHTML += `<div class="msg msg-ai">${fallbackText}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        hablarTexto(fallbackText);
      }
    }
  }

  btnChatSend.addEventListener("click", enviarMensajeChat);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviarMensajeChat();
  });

  // --- BOTÓN RESTABLECER ---
  const btnReset = document.getElementById("btn-reset");
  btnReset.addEventListener("click", () => {
    detenerVoz();
    
    // Limpiar campos e inputs
    docText.value = "";
    cameraInput.value = "";
    fileInput.value = "";
    mediaStatus.style.display = "none";
    btnMediaAnalyze.style.display = "none";
    chatHistory = [];
    ultimoTextoDocumento = "";

    // Ocultar resultados y restaurar pestañas iniciales
    resultPanel.classList.remove("show");
    mainTabs.style.display = "flex";
    examplesArea.style.display = "block";
    
    switchTab('text');
  });
});
