// Módulo de Accesibilidad y Síntesis de Voz (Text-to-Speech) para TrámiteFácil

let baseFontSize = 16;
let lectorVozActivo = false;
let vozEspanol = null;

/**
 * Inicializa y carga las voces disponibles del sistema para español
 */
export function cargarVoces() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const voces = window.speechSynthesis.getVoices();
    vozEspanol = voces.find(v => v.lang.startsWith('es-')) || voces.find(v => v.lang.startsWith('es'));
  }
}

/**
 * Cancela cualquier locución en curso
 */
export function detenerVoz() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Lee un texto en voz alta con entonación pausada y accesible para adultos mayores
 * @param {string} texto 
 */
export function hablarTexto(texto) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  detenerVoz();
  if (!texto) return;

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    // Limpieza de sintaxis markdown para que no deletree asteriscos
    const textoLimpio = texto.replace(/\*\*/g, '').replace(/_/g, '').replace(/###/g, '');

    const mensaje = new SpeechSynthesisUtterance(textoLimpio);
    if (!vozEspanol) cargarVoces();
    if (vozEspanol) {
      mensaje.voice = vozEspanol;
    }
    mensaje.rate = 0.85; // Velocidad pausada y comprensible
    mensaje.pitch = 1;
    mensaje.onerror = () => { /* Silencioso ante cancelaciones rápidas */ };
    window.speechSynthesis.speak(mensaje);
  } catch (e) {
    console.warn("Audio speech synthesis no disponible:", e);
  }
}

/**
 * Configura los botones de accesibilidad tipográfica y de contraste
 */
export function setupAccessibilityControls() {
  if (typeof window === 'undefined') return;

  // Registrar listener de cambio de voces
  cargarVoces();
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = cargarVoces;
  }

  const btnDisminuirLetra = document.getElementById("btn-disminuir-letra");
  const btnRestaurarLetra = document.getElementById("btn-restaurar-letra");
  const btnAumentarLetra = document.getElementById("btn-aumentar-letra");
  const btnAltoContraste = document.getElementById("btn-alto-contraste");
  const btnLectorVoz = document.getElementById("btn-lector-voz");
  const txtLectorVoz = document.getElementById("txt-lector-voz");

  // Aumentar letra
  if (btnAumentarLetra) {
    btnAumentarLetra.addEventListener("click", () => {
      if (baseFontSize < 26) {
        baseFontSize += 2;
        document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'px');
      }
    });
  }

  // Disminuir letra
  if (btnDisminuirLetra) {
    btnDisminuirLetra.addEventListener("click", () => {
      if (baseFontSize > 12) {
        baseFontSize -= 2;
        document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'px');
      }
    });
  }

  // Restaurar tamaño original
  if (btnRestaurarLetra) {
    btnRestaurarLetra.addEventListener("click", () => {
      baseFontSize = 16;
      document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'px');
    });
  }

  // Alternar Alto Contraste
  if (btnAltoContraste) {
    btnAltoContraste.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
      const esContraste = document.body.classList.contains("high-contrast");
      btnAltoContraste.setAttribute("aria-label", esContraste ? "Desactivar alto contraste" : "Activar alto contraste");
    });
  }

  // Lector de voz interactivo al hacer clic
  if (btnLectorVoz && txtLectorVoz) {
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
  }

  // Listener delegado para leer elementos en modo lector activo
  document.body.addEventListener("click", (e) => {
    if (!lectorVozActivo) return;

    const elemento = e.target;
    if (
      elemento.closest('header') ||
      elemento.closest('.tabs') ||
      elemento.closest('.chat-input-row') ||
      elemento.closest('.modal') ||
      elemento.tagName === 'BUTTON' ||
      elemento.tagName === 'INPUT' ||
      elemento.tagName === 'TEXTAREA'
    ) {
      return;
    }

    const etiquetasLeibles = ['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'SPAN', 'DIV'];
    if (etiquetasLeibles.includes(elemento.tagName) && elemento.textContent.trim()) {
      hablarTexto(elemento.textContent || elemento.innerText);
    }
  });

  // Delegación de clics en botones de audio por sección
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
        hablarTexto(targetElement.value || targetElement.textContent || targetElement.innerText);
      }
    }
  });
}
