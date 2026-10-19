import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  STRIPE_PLANS, 
  getAllPlans, 
  getPlan, 
  hasFeatureAccess, 
  createCheckoutSession, 
  setActiveSubscription, 
  getActiveSubscription, 
  resetToFree, 
  simulateWebhookEvent 
} from '../js/stripeService.js';

test('Monetización - Catálogo de Planes Comerciales Definido', () => {
  const plans = getAllPlans();
  assert.equal(plans.length, 4, 'Deben existir 4 planes comerciales (Free, Pay-per-use, Anual y B2B Gestoría)');
  
  const free = getPlan('free');
  assert.equal(free.precioMensualUsd, 0);
  assert.equal(free.ocrLocal, true);

  const express = getPlan('prod_tramite_express_pay');
  assert.equal(express.precioUsd, 1.99);
  assert.equal(express.redaccionAvanzadaIA, true);

  const anual = getPlan('prod_tramite_pro_annual');
  assert.equal(anual.precioAnualUsd, 29.99);
  assert.equal(anual.prorrogasHaciendaTrafico, true);

  const b2b = getPlan('prod_tramite_gestoria_b2b');
  assert.equal(b2b.precioAnualUsd, 149.00);
  assert.equal(b2b.procesamientoMasivo, true);
});

test('Monetización - Control de Acceso por Característica (Feature Gate)', () => {
  // Plan Free no tiene procesamiento masivo ni redacción avanzada ilimitada
  assert.equal(hasFeatureAccess('free', 'procesamientoMasivo'), false);
  assert.equal(hasFeatureAccess('free', 'redaccionAvanzadaIA'), false);
  assert.equal(hasFeatureAccess('free', 'ocrLocal'), true);

  // Plan Express tiene redacción avanzada pero no masivo
  assert.equal(hasFeatureAccess('prod_tramite_express_pay', 'redaccionAvanzadaIA'), true);
  assert.equal(hasFeatureAccess('prod_tramite_express_pay', 'procesamientoMasivo'), false);

  // Plan B2B tiene todo
  assert.equal(hasFeatureAccess('prod_tramite_gestoria_b2b', 'procesamientoMasivo'), true);
  assert.equal(hasFeatureAccess('prod_tramite_gestoria_b2b', 'exportacionCsvJson'), true);
});

test('Monetización - Generación de Sesión de Checkout Stripe', () => {
  const sessionFree = createCheckoutSession('free');
  assert.equal(sessionFree.success, true);
  assert.equal(sessionFree.mode, 'free');

  const sessionPaid = createCheckoutSession('prod_tramite_pro_annual', { email: 'test@ejemplo.com' });
  assert.equal(sessionPaid.success, true);
  assert.equal(sessionPaid.mode, 'stripe_hosted_checkout');
  assert.match(sessionPaid.checkoutUrl, /buy\.stripe\.com/);
  assert.match(sessionPaid.checkoutUrl, /prefilled_email=test%40ejemplo\.com/);
  assert.equal(sessionPaid.amountUsd, 29.99);
});

test('Monetización - Ciclo de Vida de Suscripción y Webhook Mock', () => {
  resetToFree();
  assert.equal(getActiveSubscription().id, 'free');

  const webhookResult = simulateWebhookEvent('cs_test_session_123', 'prod_tramite_gestoria_b2b', 'asesoria@gestoria.es');
  assert.equal(webhookResult.success, true);
  assert.equal(webhookResult.event, 'checkout.session.completed');
  assert.equal(getActiveSubscription().id, 'prod_tramite_gestoria_b2b');

  resetToFree();
  assert.equal(getActiveSubscription().id, 'free');
});
