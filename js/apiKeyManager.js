// Módulo de Administración de Clave de API de Gemini para TrámiteFácil
import { hablarTexto, detenerVoz } from './accessibility.js';

const STORAGE_KEY = "gemini_api_key";

/**
 * Obtiene la API Key de Gemini almacenada de forma segura en el navegador
 * @returns {string}
 */
export function getApiKey() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY) || "";
  }
  return "";
}

/**
 * Guarda la API Key de Gemini
 * @param {string} key 
 */
export function setApiKey(key) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
}

/**
 * Elimina la API Key de Gemini
 */
export function removeApiKey() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Actualiza el indicador visual y tooltip del botón de API en la cabecera
 */
export function actualizarIndicadorApi() {
  if (typeof document === 'undefined') return;

  const btnConfigApi = document.getElementById("btn-config-api");
  const apiStatusDot = document.getElementById("api-status-dot");
  if (!btnConfigApi || !apiStatusDot) return;

  const key = getApiKey();
  if (key) {
    apiStatusDot.className = "status-dot connected";
    btnConfigApi.title = "API de Gemini activa e integrada";
  } else {
    apiStatusDot.className = "status-dot disconnected";
    btnConfigApi.title = "Configurar clave API de Gemini (modo simulación activo)";
  }
}

/**
 * Configura los eventos del modal de API
 * @param {Function} [onStatusChange] Callback opcional cuando cambia el estado
 */
export function setupApiKeyModal(onStatusChange = null) {
  if (typeof document === 'undefined') return;

  const btnConfigApi = document.getElementById("btn-config-api") || document.getElementById("btn-dev-api-trigger");
  const modalApi = document.getElementById("modal-api");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const inputApiKey = document.getElementById("input-api-key");
  const btnSaveApi = document.getElementById("btn-save-api");
  const btnDeleteApi = document.getElementById("btn-delete-api");

  if (!modalApi) return;

  actualizarIndicadorApi();

  function abrirModal() {
    detenerVoz();
    if (inputApiKey) inputApiKey.value = getApiKey();
    modalApi.classList.add("show");
    modalApi.setAttribute("aria-hidden", "false");
    if (inputApiKey) inputApiKey.focus();
  }

  function cerrarModal() {
    modalApi.classList.remove("show");
    modalApi.setAttribute("aria-hidden", "true");
  }

  btnConfigApi?.addEventListener("click", abrirModal);
  if (btnCloseModal) btnCloseModal.addEventListener("click", cerrarModal);

  window.addEventListener("click", (e) => {
    if (e.target === modalApi) {
      cerrarModal();
    }
  });

  if (btnSaveApi && inputApiKey) {
    btnSaveApi.addEventListener("click", () => {
      const key = inputApiKey.value.trim();
      if (key) {
        setApiKey(key);
        actualizarIndicadorApi();
        cerrarModal();
        hablarTexto("Clave de API configurada y guardada correctamente.");
        if (onStatusChange) onStatusChange(true);
      } else {
        hablarTexto("Por favor, ingresa una clave válida.");
      }
    });
  }

  if (btnDeleteApi && inputApiKey) {
    btnDeleteApi.addEventListener("click", () => {
      removeApiKey();
      inputApiKey.value = "";
      actualizarIndicadorApi();
      cerrarModal();
      hablarTexto("Clave de API eliminada. Se activó el modo de simulación.");
      if (onStatusChange) onStatusChange(false);
    });
  }
}
