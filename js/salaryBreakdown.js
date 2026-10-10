// Módulo de Radiografía de Liquidación de Sueldo / Nómina para TrámiteFácil

/**
 * Normaliza y calcula totales numéricos a partir de listas de haberes y descuentos
 * @param {Array<{ amount: string | number, type?: string }>} haberes 
 * @param {Array<{ amount: string | number }>} descuentos 
 * @returns {{ totalHaberes: number, totalDescuentos: number, liquidoEstimado: number, totalImponible: number, totalNoImponible: number }}
 */
export function calcularTotalesSueldo(haberes = [], descuentos = []) {
  function extraerNumero(valor) {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    let str = String(valor).trim().replace(/[$€£\s]/g, '');

    if (str.includes('.') && str.includes(',')) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else if (str.includes('.') && !str.includes(',')) {
      const partes = str.split('.');
      const ultimaParte = partes[partes.length - 1];
      if (ultimaParte.length === 3) {
        str = str.replace(/\./g, '');
      }
    } else if (str.includes(',')) {
      str = str.replace(',', '.');
    }

    const clean = str.replace(/[^0-9.-]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : Math.abs(num);
  }

  let totalImponible = 0;
  let totalNoImponible = 0;
  let totalHaberes = 0;

  haberes.forEach(h => {
    const monto = extraerNumero(h.amount);
    totalHaberes += monto;
    if (h.type === 'no-imponible') {
      totalNoImponible += monto;
    } else {
      totalImponible += monto;
    }
  });

  let totalDescuentos = 0;
  descuentos.forEach(d => {
    totalDescuentos += extraerNumero(d.amount);
  });

  const liquidoEstimado = Math.max(0, totalHaberes - totalDescuentos);

  return {
    totalHaberes,
    totalDescuentos,
    liquidoEstimado,
    totalImponible,
    totalNoImponible
  };
}

/**
 * Genera el texto plano para la locución en voz alta del desglose salarial
 * @param {object} salaryBreakdown 
 * @returns {string}
 */
export function generarResumenVozSueldo(salaryBreakdown) {
  if (!salaryBreakdown) return "";

  let speechText = `Radiografía de tu liquidación de sueldo. Total ganado bruto: ${salaryBreakdown.totalHaberes || "$0"}. `;
  speechText += `Total de descuentos obligatorios: ${salaryBreakdown.totalDescuentos || "$0"}. `;
  speechText += `Sueldo líquido que entra a tu cuenta: ${salaryBreakdown.liquidoPagar || "$0"}. `;

  if (Array.isArray(salaryBreakdown.descuentos) && salaryBreakdown.descuentos.length > 0) {
    const detallesDescuentos = salaryBreakdown.descuentos
      .map(d => `${d.label}, ${d.amount}: ${d.desc || ''}`)
      .join(". ");
    speechText += `Descuentos aplicados: ${detallesDescuentos}.`;
  }

  return speechText;
}

/**
 * Renderiza en el DOM la sección visual de la radiografía de remuneraciones
 * @param {object | null} salaryBreakdown 
 */
export function renderSalaryBreakdown(salaryBreakdown) {
  if (typeof document === 'undefined') return;

  const salarySection = document.getElementById("r-salary-section");
  if (!salarySection) return;

  if (!salaryBreakdown) {
    salarySection.style.display = "none";
    return;
  }

  salarySection.style.display = "block";

  const totalHaberesEl = document.getElementById("salary-total-haberes");
  const totalDescuentosEl = document.getElementById("salary-total-descuentos");
  const totalLiquidoEl = document.getElementById("salary-total-liquido");

  if (totalHaberesEl) totalHaberesEl.textContent = salaryBreakdown.totalHaberes || "$0";
  if (totalDescuentosEl) totalDescuentosEl.textContent = salaryBreakdown.totalDescuentos || "$0";
  if (totalLiquidoEl) totalLiquidoEl.textContent = salaryBreakdown.liquidoPagar || "$0";

  // Renderizar Haberes
  const haberesList = document.getElementById("salary-haberes-list");
  if (haberesList) {
    haberesList.textContent = "";
    if (Array.isArray(salaryBreakdown.haberes) && salaryBreakdown.haberes.length > 0) {
      salaryBreakdown.haberes.forEach(h => {
        const esImponible = h.type === 'imponible';
        const row = document.createElement("div");
        row.className = "salary-item-row";

        const header = document.createElement("div");
        header.className = "salary-item-header";

        const titleWrap = document.createElement("div");
        titleWrap.className = "salary-item-title-wrap";

        const title = document.createElement("span");
        title.className = "salary-item-title";
        title.textContent = h.label;

        const badge = document.createElement("span");
        badge.className = `salary-item-badge ${esImponible ? 'badge-imponible' : 'badge-no-imponible'}`;
        badge.textContent = esImponible ? 'Imponible (Paga Ley)' : 'No Imponible (Bolsillo)';

        titleWrap.appendChild(title);
        titleWrap.appendChild(badge);

        const amount = document.createElement("div");
        amount.className = "salary-item-amount amount-haber";
        amount.textContent = h.amount;

        header.appendChild(titleWrap);
        header.appendChild(amount);

        const desc = document.createElement("div");
        desc.className = "salary-item-desc";
        desc.textContent = h.desc || '';

        row.appendChild(header);
        row.appendChild(desc);
        haberesList.appendChild(row);
      });
    }
  }

  // Renderizar Descuentos
  const descuentosList = document.getElementById("salary-descuentos-list");
  if (descuentosList) {
    descuentosList.textContent = "";
    if (Array.isArray(salaryBreakdown.descuentos) && salaryBreakdown.descuentos.length > 0) {
      salaryBreakdown.descuentos.forEach(d => {
        const row = document.createElement("div");
        row.className = "salary-item-row";

        const header = document.createElement("div");
        header.className = "salary-item-header";

        const titleWrap = document.createElement("div");
        titleWrap.className = "salary-item-title-wrap";

        const title = document.createElement("span");
        title.className = "salary-item-title";
        title.textContent = d.label;

        titleWrap.appendChild(title);

        const amount = document.createElement("div");
        amount.className = "salary-item-amount amount-descuento";
        amount.textContent = d.amount;

        header.appendChild(titleWrap);
        header.appendChild(amount);

        const desc = document.createElement("div");
        desc.className = "salary-item-desc";
        desc.textContent = d.desc || '';

        row.appendChild(header);
        row.appendChild(desc);
        descuentosList.appendChild(row);
      });
    }
  }

  // Actualizar contenedor de texto de voz
  const speechBox = document.getElementById("r-salary-summary-speech");
  if (speechBox) {
    speechBox.textContent = generarResumenVozSueldo(salaryBreakdown);
  }
}
