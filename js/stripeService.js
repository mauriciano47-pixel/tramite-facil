/**
 * ============================================================================
 * TRÁMITEFÁCIL — Servicio de Monetización, Suscripciones y Checkout (Stripe & SaaS)
 * Versión: 1.6.0 (Grado Institucional AAA)
 * ============================================================================
 * Asistente de Gestión de Trámites y Documentación Burocrática Ciudadana
 * Arquitectura de cobro Pay-per-use & SaaS para validación M&A (Acquire.com / Flippa)
 * Cumple con PCI-DSS SAQ-A (sin retención de números de tarjeta en cliente)
 */

export const STRIPE_PLANS = {
  FREE: {
    id: 'free',
    nombre: 'Ciudadano Estándar',
    precioMensualUsd: 0,
    precioTexto: '100% Gratis',
    periodo: 'ilimitado',
    ocrLocal: true,
    explicacionSencilla: true,
    plantillasEstandar: true,
    asistenteChatLimite: 5,
    exportacionPdf: true,
    procesamientoMasivo: false,
    soportePrioritario: false
  },
  EXPRESS_PAY_PER_USE: {
    id: 'prod_tramite_express_pay',
    priceId: 'price_tramite_express_199',
    nombre: 'Trámite Asistido Express (Pay-per-use)',
    precioUsd: 1.99,
    precioTexto: '$1.99 USD / trámite',
    periodo: 'pago_unico',
    ocrLocal: true,
    explicacionSencilla: true,
    plantillasEstandar: true,
    redaccionAvanzadaIA: true,
    recursoReposicionOficial: true,
    asistenteChatLimite: 9999,
    exportacionPdf: true,
    procesamientoMasivo: false,
    soportePrioritario: true,
    stripeCheckoutUrl: 'https://buy.stripe.com/test_tramite_express_199'
  },
  PRO_CIUDADANO_ANUAL: {
    id: 'prod_tramite_pro_annual',
    priceId: 'price_tramite_annual_2999',
    nombre: 'Pack Ciudadano & Emprendedor (Anual - Ahorro 40%)',
    precioMensualUsd: 2.49,
    precioAnualUsd: 29.99,
    precioTexto: '$29.99 USD / año',
    periodo: 'anual',
    ocrLocal: true,
    explicacionSencilla: true,
    plantillasEstandar: true,
    redaccionAvanzadaIA: true,
    recursoReposicionOficial: true,
    radiografiaSalarialAvanzada: true,
    prorrogasHaciendaTrafico: true,
    asistenteChatLimite: 9999,
    exportacionPdf: true,
    procesamientoMasivo: false,
    soportePrioritario: true,
    stripeCheckoutUrl: 'https://buy.stripe.com/test_tramite_pro_annual_2999'
  },
  GESTORIA_B2B: {
    id: 'prod_tramite_gestoria_b2b',
    priceId: 'price_tramite_gestoria_annual_149',
    nombre: 'Licencia Gestoría & Asesoría Legal (B2B)',
    precioMensualUsd: 12.41,
    precioAnualUsd: 149.00,
    precioTexto: '$149.00 USD / año',
    periodo: 'anual',
    ocrLocal: true,
    explicacionSencilla: true,
    plantillasEstandar: true,
    redaccionAvanzadaIA: true,
    recursoReposicionOficial: true,
    radiografiaSalarialAvanzada: true,
    prorrogasHaciendaTrafico: true,
    asistenteChatLimite: 9999,
    exportacionPdf: true,
    procesamientoMasivo: true,
    exportacionCsvJson: true,
    marcaBlanca: true,
    soportePrioritario: true,
    stripeCheckoutUrl: 'https://buy.stripe.com/test_tramite_gestoria_b2b_149'
  }
};

const STORAGE_KEY_SUB = "tramitefacil_active_subscription";
let inMemoryStore = {};

function getItem(key) {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return inMemoryStore[key] || null;
}

function setItem(key, val) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, val);
  } else {
    inMemoryStore[key] = val;
  }
}

function removeItem(key) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  } else {
    delete inMemoryStore[key];
  }
}

/**
 * Obtiene la lista completa de planes comerciales
 */
export function getAllPlans() {
  return Object.values(STRIPE_PLANS);
}

/**
 * Obtiene un plan por su identificador
 * @param {string} planId
 */
export function getPlan(planId) {
  if (!planId) return STRIPE_PLANS.FREE;
  const match = Object.values(STRIPE_PLANS).find(p => p.id === planId || p.priceId === planId);
  return match || STRIPE_PLANS.FREE;
}

/**
 * Obtiene el plan activo en el almacenamiento local o en memoria
 */
export function getActiveSubscription() {
  try {
    const raw = getItem(STORAGE_KEY_SUB);
    if (!raw) return STRIPE_PLANS.FREE;
    const parsed = JSON.parse(raw);
    return getPlan(parsed.planId);
  } catch (e) {
    return STRIPE_PLANS.FREE;
  }
}

/**
 * Establece o actualiza el plan activo
 * @param {string} planId
 * @param {string} [customerEmail]
 */
export function setActiveSubscription(planId, customerEmail = "") {
  const plan = getPlan(planId);
  const subData = {
    planId: plan.id,
    planNombre: plan.nombre,
    customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : "",
    activatedAt: new Date().toISOString(),
    status: 'active'
  };
  setItem(STORAGE_KEY_SUB, JSON.stringify(subData));
  return plan;
}

/**
 * Restablece la suscripción al nivel gratuito
 */
export function resetToFree() {
  removeItem(STORAGE_KEY_SUB);
  return STRIPE_PLANS.FREE;
}

/**
 * Valida si el plan actual tiene acceso a una característica específica
 * @param {string} currentPlanId
 * @param {string} featureKey
 */
export function hasFeatureAccess(currentPlanId, featureKey) {
  const plan = getPlan(currentPlanId);
  return Boolean(plan[featureKey]);
}

/**
 * Crea una sesión de checkout simulada o redirige a Stripe Hosted Checkout
 * @param {string} planId
 * @param {Object} [options]
 */
export function createCheckoutSession(planId, options = {}) {
  const plan = getPlan(planId);
  if (plan.id === STRIPE_PLANS.FREE.id) {
    return {
      success: true,
      mode: 'free',
      message: 'Plan Gratuito activado sin necesidad de pasarela de pago.'
    };
  }

  const email = (options.email || "").trim();
  const sessionToken = `cs_test_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

  return {
    success: true,
    mode: 'stripe_hosted_checkout',
    checkoutUrl: `${plan.stripeCheckoutUrl}?client_reference_id=${sessionToken}&prefilled_email=${encodeURIComponent(email)}`,
    sessionToken: sessionToken,
    planId: plan.id,
    amountUsd: plan.precioAnualUsd || plan.precioUsd || plan.precioMensualUsd,
    currency: 'usd'
  };
}

/**
 * Simula la respuesta exitosa de un webhook de Stripe (checkout.session.completed)
 * @param {string} sessionToken
 * @param {string} planId
 * @param {string} customerEmail
 */
export function simulateWebhookEvent(sessionToken, planId, customerEmail) {
  if (!sessionToken || !planId) {
    return { success: false, error: 'Parámetros inválidos' };
  }
  const updatedPlan = setActiveSubscription(planId, customerEmail);
  return {
    success: true,
    event: 'checkout.session.completed',
    activePlan: updatedPlan,
    timestamp: new Date().toISOString()
  };
}
