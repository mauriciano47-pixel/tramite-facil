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
    },
    draftTemplates: {
      prorroga: `A LA AGENCIA ESTATAL DE ADMINISTRACIÓN TRIBUTARIA (AEAT)
DELEGACIÓN / ADMINISTRACIÓN DE: [CIUDAD / PROVINCIA]

DATOS DEL INTERESADO/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [NÚMERO DE DNI O NIE]
Domicilio a efectos de notificaciones: [TU DIRECCIÓN COMPLETA]
Teléfono de contacto: [TU TELÉFONO]

EXPEDIENTE / REFERENCIA: [NÚMERO DE EXPEDIENTE INDICADO EN LA NOTIFICACIÓN]
ASUNTO: Solicitud de ampliación de plazo para requerimiento de IRPF

EXPONE:
1. Que con fecha [FECHA DE RECEPCIÓN], he sido notificado/a del requerimiento correspondiente al expediente arriba referenciado.
2. Que para aportar la totalidad de los justificantes y comprobantes solicitados de forma fehaciente, me encuentro en proceso de recopilación de facturas y certificados emitidos por terceros entidades bancarias/arrendadores.
3. Que de conformidad con el artículo 91 del Reglamento General de Gestión e Inspección Tributaria y la Ley General Tributaria, la concesión de ampliación de plazo no perjudica derechos de terceros ni el interés público.

SOLICITA:
Que se tenga por presentado este escrito en tiempo y forma, y se sirva conceder una AMPLIACIÓN DE PLAZO por la mitad del plazo inicialmente concedido (5 días hábiles adicionales), a fin de cumplimentar debidamente el requerimiento formulado.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

      justificantes: `A LA AGENCIA ESTATAL DE ADMINISTRACIÓN TRIBUTARIA (AEAT)
DELEGACIÓN / ADMINISTRACIÓN DE: [CIUDAD / PROVINCIA]

DATOS DEL INTERESADO/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [NÚMERO DE DNI O NIE]
Domicilio a efectos de notificaciones: [TU DIRECCIÓN COMPLETA]

EXPEDIENTE / REFERENCIA: [NÚMERO DE EXPEDIENTE]
ASUNTO: Aportación de documentación justificativa de IRPF

EXPONE:
1. Que en atención al requerimiento de fecha [FECHA DE LA NOTIFICACIÓN], cumplo en presentar dentro del plazo reglamentario los documentos solicitados para justificar las deducciones aplicadas en mi declaración de IRPF.
2. Que se adjuntan a este escrito los siguientes documentos:
   - Anexo I: Justificantes bancarios y transferencias de pago de alquiler/gastos.
   - Anexo II: Copia de contrato de arrendamiento / recibos oficiales vigentes.
   - Anexo III: Certificados de retenciones complementarios.

SOLICITA:
Que se tengan por aportados los documentos reseñados, dándose por cumplimentado en todos sus extremos el requerimiento de referencia y confirmándose la liquidación efectuada.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

      descargo: `A LA AGENCIA ESTATAL DE ADMINISTRACIÓN TRIBUTARIA (AEAT)
DELEGACIÓN / ADMINISTRACIÓN DE: [CIUDAD / PROVINCIA]

DATOS DEL INTERESADO/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [NÚMERO DE DNI O NIE]
Domicilio a efectos de notificaciones: [TU DIRECCIÓN COMPLETA]

EXPEDIENTE / REFERENCIA: [NÚMERO DE EXPEDIENTE]
ASUNTO: Escrito de alegaciones frente a propuesta de liquidación provisional

EXPONE:
1. Que habiendo recibido propuesta de modificación de las deducciones consignadas en mi IRPF, manifiesto mi disconformidad fundada con los ajustes propuestos.
2. Que todos los importes declarados corresponden fielmente a desembolsos reales, efectivos y vinculados a las deducciones reconocidas legalmente en la normativa fiscal aplicable.
3. Que no ha existido ocultación ni ánimo defraudatorio alguno, habiendo cumplido puntualmente con mis deberes fiscales como contribuyente de buena fe.

SOLICITA:
Que previa valoración de las presentes alegaciones y de los justificantes acompañados, se deje sin efecto la modificación propuesta y se ratifique la declaración originaria presentada.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`
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
    },
    draftTemplates: {
      prorroga: `A LA JEFATURA PROVINCIAL DE TRÁFICO / ORGANISMO SANCIONADOR
DIRECCIÓN: [CIUDAD / PROVINCIA DE LA SANCIÓN]

DATOS DEL INTERESADO/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [NÚMERO DE DNI O NIE]
Domicilio: [TU DIRECCIÓN COMPLETA]
Teléfono: [TU TELÉFONO]

NÚMERO DE EXPEDIENTE SANCIONADOR: [NÚMERO DE EXPEDIENTE / BOLETÍN]
MATRÍCULA DEL VEHÍCULO: [MATRÍCULA]

ASUNTO: Solicitud de suspensión cautelar de plazo por solicitud de copia de pruebas

EXPONE:
1. Que he recibido notificación de incoación de expediente sancionador por supuesta infracción de velocidad.
2. Que a fin de ejercer plenamente mi derecho de defensa, requiero el acceso al certificado de homologación y revisión periódica del cinemómetro (radar), así como la fotografía original en soporte digital donde conste con nitidez la matrícula y el margen de error legal aplicado.
3. Que mientras no se facilite dicha documentación técnica, se produce indefensión formal.

SOLICITA:
La suspensión del plazo de pago y alegaciones hasta tanto se dé traslado de la documentación técnica solicitada.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

      justificantes: `A LA JEFATURA PROVINCIAL DE TRÁFICO / ORGANISMO SANCIONADOR
DIRECCIÓN: [CIUDAD / PROVINCIA]

DATOS DEL TITULAR DEL VEHÍCULO:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [TU DNI O NIE]
Vehículo Matrícula: [MATRÍCULA]

EXPEDIENTE: [NÚMERO DE EXPEDIENTE DE LA MULTA]
ASUNTO: Identificación formal del conductor responsable

EXPONE:
Que en cumplimiento del requerimiento recibido en el expediente de referencia, procedo a identificar a la persona que conducía el vehículo al momento de la supuesta infracción:

DATOS DEL CONDUCTOR IDENTIFICADO:
- Nombre y Apellidos: [NOMBRE COMPLETO DEL CONDUCTOR]
- DNI / NIE / Pasaporte: [DNI DEL CONDUCTOR]
- Número de Permiso de Conducir: [NÚMERO DE PERMISO]
- Domicilio completo: [DIRECCIÓN DEL CONDUCTOR]

SOLICITA:
Que se tenga por cumplida la obligación de identificación de conductor y se dirija el expediente sancionador a la persona indicada.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

      descargo: `A LA JEFATURA PROVINCIAL DE TRÁFICO / ORGANISMO SANCIONADOR
DIRECCIÓN: [CIUDAD / PROVINCIA]

DATOS DEL INTERESADO/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [TU DNI O NIE]
Expediente Sancionador: [NÚMERO DE EXPEDIENTE]
Matrícula: [MATRÍCULA]

ASUNTO: Pliego de alegaciones y descargo frente a denuncia de tráfico

EXPONE:
1. Que no reconozco la comisión de la infracción en los términos denunciados.
2. Que la fotografía adjunta no acredita de forma indubitada la velocidad exacta del vehículo, no constando la debida aplicación de los márgenes de error legalmente exigidos por la Orden ICT/155/2020 para cinemómetros estáticos/móviles.
3. Que no consta certificado metrológico en vigor que demuestre que el aparato medidor superó la verificación periódica anual obligatoria.

SOLICITA:
Que se admita a trámite este escrito, se aporten al expediente las pruebas metrológicas interesadas y, en su defecto, se proceda al sobreseimiento y archivo del presente expediente sin sanción.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`
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
      inasistencia: "Si no asistes o no te presentas, el tribunal declarará tu situación en rebeldía procesal y dictará sentencia en tu contra sin escuchar tu versión. ¡Es fundamental acudir o justificar formalmente tu ausencia antes de la fecha fijada!",
      default: "Esta citación es un asunto serio. Te aconsejo que lleves este papel a un abogado de confianza o solicites asesoría gratuita de oficio en el colegio de abogados de tu ciudad de inmediato."
    },
    draftTemplates: {
      prorroga: `AL JUZGADO DE PRIMERA INSTANCIA Nº [NÚMERO DE JUZGADO]
DE: [CIUDAD / PARTIDO JUDICIAL]

AUTOS / PROCEDIMIENTO: [TIPO DE JUICIO Y NÚMERO DE EXPEDIENTE, EJ: JUICIO VERBAL 000/2026]

DATOS DEL DEMANDADO/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [NÚMERO DE DNI O NIE]
Domicilio: [TU DIRECCIÓN COMPLETA]

ASUNTO: Solicitud de suspensión de plazo para solicitar Asistencia Jurídica Gratuita (Abogado de Oficio)

EXPONE:
1. Que en fecha [FECHA DE NOTIFICACIÓN], me ha sido notificada cédula de emplazamiento en el procedimiento referenciado.
2. Que careciendo de recursos económicos suficientes para litigar y siendo preceptiva/conveniente la asistencia letrada para garantizar la tutela judicial efectiva (Art. 24 CE), he procedido a solicitar el reconocimiento del derecho a la Asistencia Jurídica Gratuita ante el Colegio de Abogados.
3. Que el artículo 16 de la Ley 1/1996 de Asistencia Jurídica Gratuita establece la suspensión de los plazos procesales para contestar a la demanda hasta que se designe abogado y procurador de oficio.

SOLICITA:
Que se acuerde la SUSPENSIÓN INMEDIATA de los plazos procesales pendientes hasta tanto se proceda a la designación efectiva de profesionales de oficio para mi defensa.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

      justificantes: `AL JUZGADO DE PRIMERA INSTANCIA Nº [NÚMERO DE JUZGADO]
DE: [CIUDAD / SEDE JUDICIAL]

PROCEDIMIENTO: [NÚMERO DE AUTOS / EXPEDIENTE JUDICIAL]

DATOS DEL INTERESADO/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
DNI / NIE: [NÚMERO DE DNI O NIE]
En calidad de: Demandado/a

ASUNTO: Aportación de justificante de pago / cumplimiento de requerimiento

EXPONE:
1. Que en relación al requerimiento judicial formulado en los autos de referencia, comparezco en tiempo y aporto los documentos acreditativos del cumplimiento de la obligación requerida.
2. Se acompaña al presente escrito:
   - Documento Nº 1: Justificante bancario de liquidación o pago realizado.
   - Documento Nº 2: Copia de comunicación previa remitida a la parte actora.

SOLICITA:
Que se tengan por recibidos los documentos indicados, teniéndose por atendido en tiempo y forma el requerimiento judicial.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

      descargo: `AL JUZGADO DE PRIMERA INSTANCIA Nº [NÚMERO DE JUZGADO]
DE: [CIUDAD / SEDE JUDICIAL]

AUTOS: [NÚMERO DE PROCEDIMIENTO Y AÑO]

PARTE DEMANDADA: [TU NOMBRE Y APELLIDOS], con DNI [TU DNI]
Domicilio: [TU DIRECCIÓN COMPLETA]

ASUNTO: Escrito de personación y contestación sucinta de demanda

EXPONE:
1. Que mediante el presente escrito comparezco ante este Tribunal y formulo mi total disconformidad con las pretensiones de la demanda formulada de adverso.
2. Que la cantidad o prestación reclamada resulta improcedente, habiéndose extinguido la obligación con anterioridad / no constando causa jurídica legítima que justifique el cobro reclamado.
3. Que no reconozco la exactitud de los documentos aportados por la contraparte por carecer de fuerza probatoria suficiente.

SOLICITA:
Que se me tenga por personado en tiempo y forma, desestimando íntegramente las pretensiones de la parte demandante, con expresa imposición de costas a la misma.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`
    }
  }
};
