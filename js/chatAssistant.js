// Módulo de Asistente de Chat Clarificador para TrámiteFácil
import { hablarTexto, detenerVoz } from './accessibility.js';
import { getApiKey } from './apiKeyManager.js';
import { fetchConTimeout } from './documentClassifier.js';

let chatHistory = [];

/**
 * Resuelve una pregunta del usuario mediante heurística cuando no hay conexión o API Key
 * @param {string} query 
 * @param {object} [activeData] 
 * @returns {string}
 */
export function responderConsultaHeuristica(query = "", activeData = null) {
  const queryLower = query.toLowerCase();

  if (activeData && activeData.chatResponses) {
    if (queryLower.includes("salud") || queryLower.includes("fonasa") || queryLower.includes("isapre") || queryLower.includes("7%")) {
      return activeData.chatResponses.salud || "El descuento de salud del 7% es obligatorio por ley y financia tu atención médica y subsidio de licencias.";
    }
    if (queryLower.includes("afp") || queryLower.includes("pension") || queryLower.includes("pensión") || queryLower.includes("jubilacion") || queryLower.includes("jubilación") || queryLower.includes("previsión") || queryLower.includes("prevision")) {
      return activeData.chatResponses.afp || "El descuento previsional o AFP es obligatorio por ley para financiar tu cuenta individual de pensión futura.";
    }
    if (queryLower.includes("imponible") || queryLower.includes("no imponible") || queryLower.includes("colacion") || queryLower.includes("colación") || queryLower.includes("movilizacion") || queryLower.includes("movilización")) {
      return activeData.chatResponses.imponible || "Los haberes imponibles descuentan salud y previsión; los no imponibles llegan íntegros a tu bolsillo sin descuentos.";
    }
    if (queryLower.includes("liquido") || queryLower.includes("líquido") || queryLower.includes("bolsillo") || queryLower.includes("cuanto me llega") || queryLower.includes("cuánto me llega") || queryLower.includes("neto")) {
      return activeData.chatResponses.liquido || "El Sueldo Líquido es el monto neto final que depositan en tu cuenta tras restar todos los descuentos legales.";
    }
    if (queryLower.includes("cesantia") || queryLower.includes("cesantía") || queryLower.includes("afc") || queryLower.includes("desempleo")) {
      return activeData.chatResponses.cesantia || "El Seguro de Cesantía (AFC) descuenta 0.6% solo en contratos indefinidos para protegerte ante un eventual desempleo.";
    }
    if (queryLower.includes("plazo") || queryLower.includes("cuando") || queryLower.includes("fecha") || queryLower.includes("limite") || queryLower.includes("tiempo") || queryLower.includes("vence") || queryLower.includes("cuanto tiempo")) {
      return activeData.chatResponses.plazo || activeData.chatResponses.default;
    }
    if (queryLower.includes("documento") || queryLower.includes("papel") || queryLower.includes("requisito") || queryLower.includes("que llevar") || queryLower.includes("presentar")) {
      return activeData.chatResponses.documento || activeData.chatResponses.default;
    }
    if (queryLower.includes("descuento") || queryLower.includes("pagar") || queryLower.includes("dinero") || queryLower.includes("multa") || queryLower.includes("costo") || queryLower.includes("rebaja")) {
      return activeData.chatResponses.descuento || activeData.chatResponses.default;
    }
    if (queryLower.includes("abogado") || queryLower.includes("defensa") || queryLower.includes("juicio") || queryLower.includes("juez") || queryLower.includes("letrado")) {
      return activeData.chatResponses.abogado || activeData.chatResponses.default;
    }
    if (queryLower.includes("inasistencia") || queryLower.includes("no ir") || queryLower.includes("no voy") || queryLower.includes("no asisto") || queryLower.includes("no puedo ir") || queryLower.includes("no puedo asistir") || queryLower.includes("faltar") || queryLower.includes("falto") || queryLower.includes("rebeldia") || queryLower.includes("incomparecencia")) {
      return activeData.chatResponses.inasistencia || activeData.chatResponses.default;
    }
    return activeData.chatResponses.default;
  }

  return "Esto significa que debes realizar la acción indicada dentro de los días hábiles que estipula el papel para evitar multas.";
}

function appendChatMessage(container, text, type, id = null) {
  if (!container) return;
  const msg = document.createElement("div");
  msg.className = `msg msg-${type}`;
  if (id) msg.id = id;
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

/**
 * Reinicia el historial del chat
 */
export function reiniciarChat() {
  chatHistory = [];
  if (typeof document !== 'undefined') {
    const chatMessages = document.getElementById("chat-messages");
    if (chatMessages) {
      chatMessages.textContent = "";
      appendChatMessage(chatMessages, "Hola, he analizado la carga del documento. ¿Qué parte te gustaría que te explique más a fondo?", "ai");
    }
  }
}

/**
 * Configura los eventos del chat clarificador
 * @param {() => object} getActiveDataFn 
 * @param {() => string} getLastTextFn 
 */
export function setupChatAssistant(getActiveDataFn, getLastTextFn) {
  if (typeof document === 'undefined') return;

  const chatInput = document.getElementById("chat-input");
  const btnChatSend = document.getElementById("btn-chat-send");
  const chatMessages = document.getElementById("chat-messages");

  if (!chatInput || !btnChatSend || !chatMessages) return;

  async function enviarMensajeChat() {
    const query = chatInput.value.trim();
    if (!query) return;

    appendChatMessage(chatMessages, query, "user");
    chatInput.value = "";

    detenerVoz();
    const apiKey = getApiKey();
    const activeData = getActiveDataFn();
    const lastText = getLastTextFn();

    if (!apiKey) {
      setTimeout(() => {
        const responseText = responderConsultaHeuristica(query, activeData);
        appendChatMessage(chatMessages, responseText, "ai");
        hablarTexto(responseText);
      }, 700);
      return;
    }

    // Flujo real con Gemini
    appendChatMessage(chatMessages, "Pensando...", "ai", "chat-loading-bubble");

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const historialPrompt = chatHistory.map(h => `${h.role}: ${h.text}`).join("\n");
      const prompt = `Eres un asistente empático y sencillo que ayuda a adultos mayores a entender el siguiente documento oficial.

Texto del documento:
${lastText || (activeData ? activeData.translation : "")}

Historial de conversación anterior:
${historialPrompt}

Pregunta del usuario:
${query}

Responde de manera muy clara, directa y en español de forma comprensible para una persona mayor. Evita términos legales complicados y sé muy empático. Tu respuesta debe tener máximo 3 oraciones cortas y resolver la duda de forma simple. No incluyas código ni caracteres especiales.`;

      const response = await fetchConTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 }
        })
      }, 8000);

      if (!response.ok) throw new Error(`Error en el chat: ${response.status}`);

      const resData = await response.json();
      const responseText = resData.candidates[0].content.parts[0].text.trim();

      const loadingBubble = document.getElementById("chat-loading-bubble");
      if (loadingBubble) loadingBubble.remove();

      appendChatMessage(chatMessages, responseText, "ai");

      chatHistory.push({ role: "usuario", text: query });
      chatHistory.push({ role: "asistente", text: responseText });

      hablarTexto(responseText);

    } catch (err) {
      console.warn("Fallo o timeout en chat Gemini, activando fallback local:", err);
      const loadingBubble = document.getElementById("chat-loading-bubble");
      if (loadingBubble) loadingBubble.remove();

      const fallbackText = responderConsultaHeuristica(query, activeData);
      appendChatMessage(chatMessages, fallbackText, "ai");
      hablarTexto(fallbackText);
    }
  }

  btnChatSend.addEventListener("click", enviarMensajeChat);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviarMensajeChat();
  });
}
