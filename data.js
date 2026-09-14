// Base de datos de ejemplos y respuestas estructuradas en español
window.TRAMITE_EXAMPLES = {
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
    }
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
    }
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
      inasistencia: "Si no asistes, el juez asumirá que aceptas los cargos de la demanda y dictará sentencia en tu contra inmediatamente. ¡No faltes!",
      default: "Esta citación es un asunto serio. Te aconsejo que lleves este papel a un abogado de confianza o solicites asesoría gratuita de oficio en el colegio de abogados de tu ciudad de inmediato."
    }
  }
};
