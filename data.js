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
    draftTemplates: {
      prorroga: `A LA DIRECCIÓN DE RECURSOS HUMANOS / EMPLEADOR: [NOMBRE DE LA EMPRESA O EMPLEADOR]
DIRECCIÓN / SEDE: [DIRECCIÓN DE LA EMPRESA O SUCURSAL]

DATOS DEL TRABAJADOR/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
RUT / DNI: [TU RUT O DOCUMENTO DE IDENTIDAD]
Cargo o Función: [TU CARGO EN LA EMPRESA]
Fecha de ingreso: [FECHA DE INICIO DE CONTRATO]

ASUNTO: Solicitud formal de aclaración y desglose de liquidación de sueldo del mes de [MES Y AÑO]

EXPONE:
1. Que habiendo recibido y revisado la liquidación de remuneraciones correspondiente al periodo de [MES Y AÑO], he constatado dudas e inconsistencias en determinados ítems de cálculo y retenciones.
2. Que específicamente requiero el desglose detallado de los siguientes conceptos:
   - Base de cálculo de los descuentos aplicados bajo la glosa: [INDICAR GLOSA O DESCUENTO DUDOSO].
   - Detalle del cálculo de horas extras / comisiones devengadas durante el periodo.
3. Que conforme al Código del Trabajo, el trabajador tiene derecho a conocer con exactitud la procedencia de cada haber y retención efectuada en su remuneración mensual.

SOLICITA:
Se sirva proporcionar el informe de cálculo detallado y, en caso de existir un error u omisión material, se proceda al ajuste y pago complementario correspondiente en el plazo más breve.

En [CIUDAD], a [FECHA ACTUAL].

Firma del Trabajador/a: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

      justificantes: `A LA DIRECCIÓN DE RECURSOS HUMANOS / EMPLEADOR: [NOMBRE DE LA EMPRESA]
DIRECCIÓN: [DIRECCIÓN DE LA EMPRESA]

DATOS DEL TRABAJADOR/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
RUT / DNI: [TU RUT O DNI]
Cargo: [TU CARGO]

ASUNTO: Acreditación de antecedentes para incorporación de asignación familiar y cargas legales

EXPONE:
1. Que mediante la presente comunicación acompaño la documentación oficial necesaria para la debida incorporación y pago del beneficio de Asignación Familiar en mi liquidación mensual.
2. Se adjuntan los siguientes antecedentes comprobatorios:
   - Certificado de Nacimiento / Alumno Regular de: [NOMBRE DE LA CARGA O BENEFICIARIO].
   - Declaración jurada de ingresos / antecedentes correspondientes.
3. Que dichos antecedentes acreditan el cumplimiento íntegro de los requisitos legales exigidos.

SOLICITA:
Se sirva ingresar formalmente la carga familiar en el sistema previsional y proceder a la liquidación del monto asignado en la próxima fecha de pago de remuneraciones.

En [CIUDAD], a [FECHA ACTUAL].

Firma: ____________________________________
[TU NOMBRE Y APELLIDOS]`,

      descargo: `A LA DIRECCIÓN DE RECURSOS HUMANOS / GERENCIA: [NOMBRE DE LA EMPRESA]
DIRECCIÓN: [DIRECCIÓN DE LA EMPRESA]

DATOS DEL TRABAJADOR/A:
Nombre y Apellidos: [TU NOMBRE Y APELLIDOS]
RUT / DNI: [TU RUT O DOCUMENTO DE IDENTIDAD]
Cargo: [TU CARGO]

ASUNTO: Reclamo formal por descuento indebido no autorizado en liquidación de sueldo

EXPONE:
1. Que en mi liquidación de remuneraciones correspondiente al mes de [MES Y AÑO], se ha practicado un descuento por el monto de $[MONTO DESCONTADO], bajo el concepto de [NOMBRE DEL DESCUENTO].
2. Que dicho descuento no cuenta con autorización escrita de mi parte, no se encuentra pactado en el contrato de trabajo ni responde a mandato legal ni orden judicial alguna.
3. Que el artículo 58 del Código del Trabajo prohíbe taxativamente al empleador efectuar deducciones o retenciones que no se encuentren expresamente autorizadas por ley o consentidas por escrito por el trabajador.

SOLICITA:
La restitución inmediata del monto indebidamente retenido en un plazo máximo de 5 días hábiles, haciéndose expresa reserva de recurrir ante la Inspección del Trabajo respectiva en resguardo de mis derechos laborales si no se remedia la situación.

En [CIUDAD], a [FECHA ACTUAL].

Firma del Trabajador/a: ____________________________________
[TU NOMBRE Y APELLIDOS]`
    }
  }
};
