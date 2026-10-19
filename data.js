import { DRAFT_TEMPLATES } from "./js/draftTemplatesData.js";
// Base de datos de ejemplos y respuestas estructuradas en español
export const TRAMITE_EXAMPLES = {
  hacienda: {
    what: "Es una **notificación de Hacienda** referente al Impuesto sobre la Renta de las Personas Físicas (IRPF).",
    translation: "Hacienda dice que hay inconsistencias en tus declaraciones de impuestos previas y quiere que justifiques tus deducciones con documentos oficiales.",
    steps: [
      "Revisar el borrador y los números enviados en la notificación.",
      "Buscar tus recibos anuales de gastos deducciones declaradas.",
      "Subir las justificaciones a la sede electrónica de Hacienda antes de la fecha límite."
    ],
    docs: [
      "Certificado de retenciones de la empresa o seguridad social.",
      "Justificantes de gastos (facturas de alquiler, recibos médicos, donaciones, etc.)."
    ],
    warns: [
      "Plazo fatal de **10 días hábiles** (no cuentan fines de semana ni feriados) para responder.",
      "No contestar a tiempo puede acarrear multas y la pérdida automática del derecho a deducción."
    ],
    chatResponses: {
      plazo: "El plazo es de 10 días hábiles contados a partir del día siguiente al que recibiste la carta. Recuerda que los fines de semana y feriados no se cuentan.",
      documento: "Debes adjuntar todos los recibos y facturas de los gastos que declaraste. Por ejemplo, facturas de alquiler o recibos de donaciones benéficas.",
      default: "Hacienda quiere verificar que los datos declarados coincidan con tus comprobantes. Te recomiendo juntar tus recibos del año consultado y subirlos en su web oficial o pedir cita presencial."
    },
    draftTemplates: DRAFT_TEMPLATES.hacienda
  },
  multa: {
    what: "Es una **multa por infracción de tránsito** (exceso de velocidad detectado por radar).",
    translation: "Te capturó un radar automático sobrepasando los límites de velocidad permitidos en la carretera especificada.",
    steps: [
      "Verificar en la foto de la multa si la matrícula de tu coche coincide.",
      "Identificar al conductor en caso de que tú no hayas estado manejando.",
      "Efectuar el pago online con descuento o presentar un descargo si consideras que es incorrecto."
    ],
    docs: [
      "Padrón o tarjeta de circulación del vehículo.",
      "ID de la infracción y número de expediente que figura en la carta."
    ],
    warns: [
      "Tienes un beneficio de **50% de descuento si pagas en los primeros 20 días** corridos.",
      "Si dejas pasar el plazo, el valor subirá al 100% y se iniciará un cobro ejecutivo con recargos."
    ],
    chatResponses: {
      descuento: "El descuento del 50% es automático si pagas dentro de los primeros 20 días desde la notificación. Lo puedes hacer online en la web de tránsito con tarjeta de crédito.",
      conducia: "Si conducía otra persona, tienes 20 días para informarlo en la web oficial rellenando el formulario de 'Identificación de Conductor' con su DNI.",
      default: "Es una multa por radar. Te aconsejo pagarla rápido para aprovechar el 50% de descuento, a menos que tengas pruebas contundentes de que el radar falló o el coche no era tuyo."
    },
    draftTemplates: DRAFT_TEMPLATES.multa
  },
  juzgado: {
    what: "Es una **citación del tribunal de justicia** para comparecer en un juicio verbal.",
    translation: "Se ha formalizado una demanda civil en tu contra y el juez te cita de forma obligatoria a comparecer en una audiencia programada en los tribunales.",
    steps: [
      "Contactar a un abogado defensor de confianza inmediatamente.",
      "Leer detalladamente el escrito de demanda adjunto a la citación.",
      "Presentarte el día y la hora estipulados en la dirección del tribunal especificada."
    ],
    docs: [
      "Cédula de notificación judicial original.",
      "Documento Nacional de Identidad (DNI/NIE).",
      "Pruebas o documentos que sirvan para tu defensa."
    ],
    warns: [
      "Faltar a la cita hará que pierdas el juicio por incomparecencia ('rebeldía') de manera automática.",
      "Es de carácter **obligatorio** concurrir, y en la mayoría de los casos requieres firma de abogado."
    ],
    chatResponses: {
      abogado: "Sí, es altamente recomendable (y a veces obligatorio) ir con abogado para asegurar que tus derechos estén defendidos de forma correcta.",
      inasistencia: "Si no asistes o no te presentas, el tribunal declarará tu situación en rebeldía procesal y dictará sentencia en tu contra sin escuchar tu versión. ¡Es fundamental acudir o justificar formalmente tu ausencia antes de la fecha fijada!",
      default: "Esta citación es un asunto serio. Te aconsejo que lleves este papel a un abogado de confianza o solicites asesoría gratuita de oficio en el colegio de abogados de tu ciudad de inmediato."
    },
    draftTemplates: DRAFT_TEMPLATES.juzgado
  },
  sueldo: {
    what: "Es una **liquidación de sueldo mensual (nómina de remuneración)** emitida por tu empleador.",
    translation: "Es tu comprobante de pago oficial: detalla todo lo que ganaste en el mes (Haberes brutos), lo que te descuentan por ley para tu salud y pensión (Descuentos obligatorios), y la cantidad exacta que debe entrar a tu cuenta bancaria (Líquido a pago).",
    salaryBreakdown: {
      totalHaberes: "$850.000",
      totalDescuentos: "$174.250",
      liquidoPagar: "$675.750",
      haberes: [
        { label: "Sueldo Base", amount: "$600.000", type: "imponible", desc: "Monto fijo pactado en tu contrato por tu jornada ordinaria de trabajo." },
        { label: "Gratificación Legal", amount: "$150.000", type: "imponible", desc: "Parte de las utilidades que la empresa adelanta y reparte por ley a cada trabajador." },
        { label: "Asignación de Colación y Movilización", amount: "$100.000", type: "no-imponible", desc: "Compensación de gastos para almuerzo y locomoción. Llega íntegro a tu bolsillo (no paga impuestos ni cotizaciones previsionales)." }
      ],
      descuentos: [
        { label: "Salud (Fonasa / Isapre 7%)", amount: "-$52.500", desc: "¿Por qué se descuenta?: Por mandato legal obligatorio (7% de tus haberes imponibles). Financia tu atención médica pública/privada, urgencias y el subsidio de licencias médicas." },
        { label: "Previsión / Jubilación (AFP ~11.5%)", amount: "-$86.250", desc: "¿Por qué se descuenta?: Obligatorio por ley. El 10% va a tu cuenta individual de capitalización para tu futura pensión, más el porcentaje de comisión de tu AFP administradora." },
        { label: "Seguro de Cesantía (AFC 0.6%)", amount: "-$4.500", desc: "¿Por qué se descuenta?: Aporte personal para financiar tu seguro de desempleo si tu contrato es indefinido. (Nota: Si tu contrato es a plazo fijo, ¡el trabajador paga $0, lo costea 100% la empresa!)." },
        { label: "Anticipo de Sueldo / Quincena", amount: "-$31.000", desc: "¿Por qué se descuenta?: Retención por adelanto de dinero que recibiste a mitad de mes antes de la fecha formal de pago." }
      ]
    },
    steps: [
      "Verificar que el Sueldo Líquido ($675.750) coincida exactamente con la transferencia en tu cuenta bancaria o el pago recibido.",
      "Entrar al sitio web de tu AFP y de Fonasa/Isapre para comprobar que tu empleador haya pagado y transferido las cotizaciones descontadas.",
      "Revisar que no existan cobros o descuentos por seguros o préstamos que no hayas autorizado expresamente por escrito.",
      "Firmar la copia de la liquidación o guardar el documento digital como comprobante de antigüedad y solvencia económica."
    ],
    docs: [
      "Copia de tu Contrato de Trabajo o anexos vigentes para comparar el sueldo base pactado.",
      "Cartola histórica de cotizaciones previsionales (se descarga con tu RUT y clave en la web de tu AFP).",
      "Comprobante bancario de depósito o transferencia del mes."
    ],
    warns: [
      "Tu empleador tiene plazo legal hasta el día 10 (o 13 si paga por internet en Previred) del mes siguiente para pagar tus cotizaciones. No pagarlas constituye una infracción laboral grave.",
      "Ningún empleador puede descontar montos por sanciones disciplinarias o pérdidas materiales sin un procedimiento y autorización estricta en el Reglamento Interno."
    ],
    chatResponses: {
      salud: "El descuento de salud corresponde por ley a un mínimo del 7% sobre tus haberes imponibles. Si estás en Fonasa va al fondo nacional de salud; si estás en Isapre cubre el valor de tu plan médico contratado.",
      afp: "El descuento previsional de AFP es obligatorio por ley para todo trabajador con contrato dependiente. Representa el 10% para tu fondo de vejez más la comisión de administración de tu AFP (total aprox. 11.5%).",
      imponible: "Los haberes imponibles son aquellos que pagan impuestos y cotizaciones (sueldo base, horas extras, comisiones, gratificación). Los NO imponibles (colación, transporte, viáticos) llegan 100% íntegros a tu bolsillo sin deducciones.",
      liquido: "El Sueldo Líquido es el dinero real y de bolsillo que te transfieren a tu cuenta: se obtiene restando el Total de Descuentos al Total de Haberes.",
      cesantia: "El Seguro de Cesantía (AFC) descuenta el 0.6% únicamente si tu contrato es indefinido. Si tienes contrato a plazo fijo o por obra, ¡el trabajador no paga nada, lo asume 100% el empleador!",
      default: "Es tu liquidación mensual de remuneraciones. Te aconsejo revisar que los haberes coincidan con tu contrato y que los descuentos de salud y AFP estén declarados y pagados al día."
    },
    draftTemplates: DRAFT_TEMPLATES.sueldo
  },

  pgu: {
    what: "Es una **notificación oficial sobre tu Pensión o PGU (Pensión Garantizada Universal)** emitida por el IPS o ChileAtiende.",
    translation: "El Estado te informa sobre el estado de tu pensión o subsidio mensual. Si dice que te faltan papeles de residencia o que revisarán tus ingresos, no te asustes: solo necesitan comprobar que sigues viviendo en el país o actualizar tu ficha social para continuar tus pagos con normalidad.",
    steps: [
      "Revisar si la carta te pide acreditar residencia en Chile o actualizar datos de tu hogar.",
      "Reunir tu carnet de identidad vigente y un certificado de residencia o cuenta de servicio a tu nombre.",
      "Acudir a una sucursal de ChileAtiende o ingresar a su sitio web con ClaveÚnica para ingresar el escrito de respaldo."
    ],
    docs: [
      "Cédula de Identidad chilena vigente (por ambos lados).",
      "Certificado de Residencia (emitido por junta de vecinos o notaría) o cuenta de luz/agua que demuestre que vives en el país.",
      "Cartola del Registro Social de Hogares (RSH) actualizada si solicitan justificar ingresos familiares."
    ],
    warns: [
      "Tienes **30 días corridos** para responder desde que recibiste la carta antes de que suspendan transitoriamente el pago.",
      "Si el pago fue suspendido por error administrativo, el IPS debe pagarte todos los meses acumulados de forma retroactiva al aclarar la situación."
    ],
    chatResponses: {
      plazo: "El IPS otorga generalmente 30 días para presentar los antecedentes requeridos. Si presentas tu escrito dentro de este plazo, no te descontarán ni suspenderán tu pensión.",
      documento: "Lo principal es tu Cédula de Identidad y un Certificado de Residencia que demuestre que vives en Chile. En ChileAtiende te ayudan a tramitarlo de forma gratuita.",
      descuento: "La PGU no tiene descuentos tributarios. Si recibiste un monto menor, puede ser un ajuste por el cálculo de tu pensión base o cambio de tramo en el Registro Social de Hogares.",
      default: "Esta carta se refiere a tu pensión de vejez o PGU. No te preocupes: llevando tu cédula y el escrito que te preparamos a ChileAtiende o a tu municipalidad, resolverás el trámite rápidamente."
    },
    draftTemplates: DRAFT_TEMPLATES.pgu
  },

  ges: {
    what: "Es un documento de **Garantías Explícitas en Salud (GES / AUGE)** emitido por Fonasa, Hospital o Isapre.",
    translation: "Tienes una condición médica (como artrosis, cataratas, prótesis de cadera, hipertensión o diabetes) protegida por la Ley GES. Esta ley obliga al hospital o consultorio a darte tu atención, examen o cirugía antes de un plazo máximo. Si el hospital no cumplió el plazo, tienes derecho por ley a que te manden a una clínica privada pagada al 100% por el Estado.",
    steps: [
      "Revisar en el papel la fecha en que ingresó tu orden médica GES o la fecha límite de atención.",
      "Comprobar si el plazo máximo ya venció o si te pospusieron la cita reiteradamente.",
      "Presentar el escrito de reclamo ante Fonasa o tu Isapre exigiendo la designación inmediata de un Segundo Prestador en 48 horas."
    ],
    docs: [
      "Formulario de Constancia de Notificación de Información al Paciente GES (el papel original firmado con el médico).",
      "Cédula de Identidad de la persona enferma.",
      "Orden médica o carnet de citas del consultorio/hospital donde se acredite la postergación."
    ],
    warns: [
      "Tienes **30 días corridos** desde que venció el plazo de tu garantía para reclamar el Segundo Prestador ante Fonasa.",
      "Una vez presentado el reclamo, Fonasa tiene un plazo obligatorio por ley de solo **48 horas** para asignarte una clínica u hospital de reemplazo."
    ],
    chatResponses: {
      plazo: "Por ley, Fonasa tiene un plazo fatal de 48 horas hábiles para responder a tu reclamo y asignarte un nuevo prestador o clínica si el hospital público no te atendió a tiempo.",
      documento: "Necesitas tu Cédula de Identidad y la hoja de Notificación GES que te entregó el médico tratante cuando te diagnosticó la enfermedad.",
      default: "Si el hospital te tiene en lista de espera y tu enfermedad es GES (como cataratas o artrosis), la ley te protege. Exigir el Segundo Prestador es tu derecho y acelera tu atención médica de inmediato."
    },
    draftTemplates: DRAFT_TEMPLATES.ges
  },

  contribuciones: {
    what: "Es el aviso de cobro de **Contribuciones de Bienes Raíces (Impuesto Territorial)** emitido por el SII o Tesorería.",
    translation: "Es la carta que cobra el impuesto por tu casa o departamento. Si eres una persona de la tercera edad y vives en tu casa, la Ley te protege: tienes derecho a una REBAJA del 100% (no pagar nada) o del 50% de las contribuciones si tus ingresos son de jubilación. ¡No tienes que pagar una fortuna por el techo en el que has vivido siempre!",
    steps: [
      "Revisar en el recibo el número de Rol de tu propiedad (ej: Rol 1234-56 de tu comuna).",
      "Verificar que la propiedad esté a tu nombre o de tu cónyuge y que esté destinada principalmente a habitación.",
      "Presentar el escrito de Solicitud de Rebaja de Contribuciones para Adulto Mayor ante el Servicio de Impuestos Internos (SII)."
    ],
    docs: [
      "Cédula de Identidad de la persona propietaria (mayor de 60 años en mujeres o mayor de 65 años en hombres).",
      "Número de Rol de la propiedad (aparece en la esquina superior de la carta).",
      "Última liquidación de pensión o certificado de ingresos para demostrar el tramo socioeconómico exento."
    ],
    warns: [
      "La ley beneficia a mujeres mayores de 60 años y hombres mayores de 65 años cuyo avalúo fiscal no supere el tope legal.",
      "Si ya venció una cuota y estás tramitando tu beneficio, tienes derecho a solicitar a Tesorería la suspensión de cobranza y remisión de intereses."
    ],
    chatResponses: {
      plazo: "Las contribuciones vencen habitualmente en abril, junio, septiembre y noviembre. Puedes solicitar la rebaja de adulto mayor en cualquier momento del año ante el SII.",
      documento: "Solo necesitas tu Rol de avalúo (en la carta) y tu carnet de identidad. El SII verifica tus ingresos de pensión de forma automática en sus sistemas.",
      descuento: "La ley te rebaja el 100% de la cuota (pagas $0) si tus ingresos mensuales son menores a 13,5 UTA (aprox. $800.000), o el 50% si son menores a 30 UTA.",
      default: "Como adulto mayor, el Estado no puede cobrarte contribuciones que te dejen sin dinero para comer o comprar remedios. Presenta la solicitud de rebaja de inmediato."
    },
    draftTemplates: DRAFT_TEMPLATES.contribuciones
  },

  poder: {
    what: "Es un **Poder Simple y Mandato Familiar** para cobro de pensión, retiro de medicamentos y trámites oficiales.",
    translation: "Es un documento legal firmado por ti que le da permiso a tu hijo, nieto o persona de confianza para que haga trámites en tu nombre. Con esta carta tu familiar puede ir al banco o caja de compensación a cobrar tu pensión, o ir al consultorio/hospital a retirar tus remedios sin que tengas que salir de casa, hacer filas con frío o sufrir dolores físicos.",
    steps: [
      "Revisar los nombres completos y RUT tanto de quien autoriza (tú) como de quien hará el trámite (tu familiar).",
      "Imprimir el documento y firmarlo a mano (si puedes, estampa también tu huella dactilar al lado de la firma).",
      "Adjuntar fotocopia de la cédula de identidad de ambos (ambos lados) para presentar en la caja, banco o consultorio."
    ],
    docs: [
      "Fotocopia de la Cédula de Identidad de la persona adulta mayor que otorga el poder.",
      "Fotocopia de la Cédula de Identidad de la persona de confianza que realizará el trámite.",
      "Liquidación de pensión o carnet de consultorio según el trámite a realizar."
    ],
    warns: [
      "Otorga este poder **únicamente a familiares o personas de tu absoluta y total confianza**.",
      "Este documento es 100% gratuito. Para cobro de pensión en bancos o cajas (Los Héroes, BancoEstado), no necesitas pagar notario: basta el poder simple con copias de carnet."
    ],
    chatResponses: {
      plazo: "El poder simple tiene vigencia legal para el mes del trámite o por hasta 1 año si especificas que es de carácter continuado.",
      documento: "Basta la carta firmada y la fotocopia de la cédula de identidad de quien autoriza y de quien va a cobrar o retirar los remedios.",
      default: "Este poder protege a los adultos mayores con movilidad reducida o problemas de salud. Permite que sus seres queridos los ayuden sin que ellos tengan que exponerse a trámites agotadores."
    },
    draftTemplates: DRAFT_TEMPLATES.poder
  }
};

if (typeof window !== 'undefined') {
  window.TRAMITE_EXAMPLES = TRAMITE_EXAMPLES;
}

export default TRAMITE_EXAMPLES;

