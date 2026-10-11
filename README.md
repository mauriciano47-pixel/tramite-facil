# 🗂️ TrámiteFácil — Entiende cualquier documento oficial en segundos

> Aplicación web accesible diseñada especialmente para adultos mayores y ciudadanos que necesitan traducir y comprender el lenguaje técnico, frío o complejo de notificaciones judiciales, requerimientos tributarios, multas de tránsito y formularios administrativos.

---

## 🌟 Filosofía y Propuesta de Valor

La burocracia no debería ser un obstáculo insalvable ni motivo de angustia. **TrámiteFácil** transforma cartas oficiales intimidantes en explicaciones humanas y directas ("en cristiano"), desglosando plazos fatales, acciones requeridas y documentos necesarios, garantizando plena privacidad y sin necesidad de registros ni descargas pesadas.

---

## 🚀 Guía de Procedimientos Operativos

### Procedimiento 1: Uso Rápido en Navegador (Sin instalación)
1. Descarga o clona la carpeta del proyecto.
2. Abre el archivo `index.html` con doble clic en cualquier navegador moderno (Chrome, Edge, Firefox, Safari).
3. ¡La aplicación funciona de inmediato en modo autónomo con ejemplos precargados!

### Procedimiento 2: Ejecución en Servidor Local de Desarrollo
Si deseas ejecutar la app en tu red local o probarla desde un celular conectado al mismo Wi-Fi:
```bash
# Opción A: Usando Python (nativo en la mayoría de sistemas)
python -m http.server 3000

# Opción B: Usando Node.js (npx serve)
npx serve -l 3000 .
```
Luego abre tu navegador en:
- Local: `http://localhost:3000`
- Desde otro dispositivo en tu Wi-Fi: `http://<TU_IP_LOCAL>:3000`

---

### Procedimiento 3: Experiencia Senior-First (100% Plug & Play sin Claves Técnicas)
Por filosofía de accesibilidad ciudadana, **TrámiteFácil no exige claves, tarjetas ni registros de ningún tipo**:
1. Funciona de inmediato al abrir la aplicación con ejemplos interactivos y su propio motor heurístico en español.
2. Si un usuario de la tercera edad o su familia copian un texto en el celular, disponen del botón azul **"📋 Pegar texto copiado con 1 toque"** sin lidiar con menús contextuales.
3. Si fotografían una carta impresa, la aplicación ofrece un selector táctil para identificar el trámite con 1 toque.
4. **Modo Desarrollador Opcional:** Si un técnico o programador desea vincular su clave de Google Gemini para OCR multimodal avanzado, dispone de un enlace discreto en el pie de página (*Modo Desarrollador*).

---

### Procedimiento 4: Análisis de Documentos y Fotos (Paso a Paso)
1. **Seleccionar modo de entrada:**
   - **Pegar texto:** Copia el texto digital de un correo o notificación y pulsa *"Analizar documento pegado"*, o usa el botón táctil de portapapeles.
   - **Sacar Foto:** Usa la cámara de tu teléfono móvil para fotografiar la carta o notificación.
   - **Subir Adjunto:** Selecciona una foto de tu galería o un archivo PDF oficial.
   - **Ejemplos Rápidos:** Toca cualquiera de los chips de acceso directo:
     * 👵 **Pensión y PGU (IPS / ChileAtiende):** Acreditación de residencia, reconsideración y reclamos.
     * 🏥 **Salud GES / AUGE (Fonasa):** Reclamo de Segundo Prestador en 48 horas y entrega de fármacos.
     * 🏠 **Rebaja de Contribuciones (SII):** Exención del 100% o 50% de impuesto territorial para adultos mayores.
     * ✍️ **Poder Simple Familiar:** Autorización inmediata para cobro de pensión y retiro de remedios.
     * 💼 **Liquidación de Sueldo:** Radiografía de haberes imponibles vs no imponibles y deducciones legales.
     * 📬 **Notificación de Impuestos:** Requerimientos de Hacienda y declaraciones.
     * 🚗 **Multa de Tránsito:** Partes empadronados y comparendos.
     * ⚖️ **Citación Judicial:** Juzgados de Policía Local y tribunales.
2. **Revisión del Resumen Inteligente:**
   - **¿Qué es este documento?:** Identificación precisa del emisor y tipo de trámite.
   - **Traducción simple:** Explicación cotidiana y sin jergas del contenido.
   - **Radiografía de Liquidación de Sueldo:** Desglose en 3 tarjetas (Haberes, Descuentos previsionales de Salud 7%, AFP 10%+, Cesantía AFC e Impuestos, y Líquido de Bolsillo).
   - **Pasos a seguir:** Lista enumerada de acciones ordenadas cronológicamente.
   - **Documentos que necesitas:** Papeles y comprobantes requeridos.
   - **Fechas y advertencias:** Plazos fatales (días hábiles vs. corridos) y consecuencias de inacción.
3. **Generar Carta Oficial de Respuesta en 1 Clic (Innovación v1.4.0):**
   - El generador adapta sus 3 botones automáticamente según el tipo de trámite:
     * **Adultos Mayores / PGU:** Reconsideración de PGU, Acreditación de Residencia, Reclamo por Suspensión.
     * **Salud GES:** Reclamo Segundo Prestador (48 hrs), Urgencia Medicamentos, Reclamo ante Superintendencia.
     * **Contribuciones:** Rebaja Adulto Mayor (SII), Suspensión de Cobranza (TGR), Rectificación de Avalúo.
     * **Poderes:** Poder Cobro Pensión en Banco/Caja, Poder Retiro Medicamentos Cesfam, Poder General.
     * **Laboral:** Aclaración de Sueldo, Acreditación de Cargas, Reclamo Descuento Indebido (Art. 58).
     * **Administrativo General:** Solicitud de Prórroga, Aportar Justificantes, Alegaciones / Descargo.
   - Revisa el texto en el folio editable y completa los datos entre corchetes `[COMO ESTE]`.
   - Utiliza **"Copiar Escrito"** para llevarlo al portapapeles o **"Imprimir / PDF"** para obtener una hoja formal A4 completamente limpia sin los menús de la web.
   - Si tienes API Key de Gemini configurada, pulsa **"Regenerar con IA"** para redactar un escrito altamente personalizado según el documento específico analizado.
4. **Lectura en voz alta:** Pulsa el botón de altavoz `🔊` en cualquier bloque o en el folio para escuchar el texto leído con cadencia pausada y clara.
5. **Preguntas al Asistente:** Escribe tus dudas en el chat inferior para recibir aclaraciones empáticas en un máximo de 3 oraciones.

---

### Procedimiento 5: Despliegue en la Web (Producción)

#### Opción A — Despliegue Automatizado en GitHub Pages (Recomendado)
1. Inicializa el repositorio y súbelo a GitHub:
   ```bash
   git add .
   git commit -m "feat: release produccion tramite-facil"
   gh repo create tramite-facil --public --source=. --remote=origin --push
   ```
2. En el repositorio de GitHub, dirígete a **Settings ➔ Pages**.
3. En **Branch**, selecciona `main` y la carpeta `/ (root)`, luego pulsa **Save**.
4. En 1 minuto tu aplicación estará publicada con HTTPS en:
   `https://<tu-usuario>.github.io/tramite-facil/`

#### Opción B — Despliegue en Vercel
1. Ingresa a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
2. Pulsa **"Add New Project"** e importa el repositorio `tramite-facil`.
3. Vercel detectará la configuración predeterminada en `vercel.json`.
4. Haz clic en **Deploy** y obtendrás tu dominio `.vercel.app` instantáneo.

---

### Procedimiento 6: Mantenimiento, Actualizaciones y Git
Cada vez que realices una mejora o corrección:
```bash
# 1. Comprobar estado de archivos
git status

# 2. Agregar cambios y registrar commit
git add .
git commit -m "docs/feat: descripcion clara del cambio"

# 3. Sincronizar con el repositorio remoto
git push origin main
```

---

### Procedimiento 7: Resolución de Incidencias (Troubleshooting)

| Síntoma | Causa Probable | Solución Operativa |
|---|---|---|
| La síntesis de voz no se escucha | Volumen del sistema bajo o navegador silenciado | Verifica el volumen multimedia y activa el botón "Voz Activada" en la cabecera. |
| El análisis tarda más de 8 segundos | Conexión lenta o límite de cuota en Gemini API | La app activa automáticamente el modo de respaldo local para no congelar la pantalla. |
| La foto subida no se analiza | Archivo mayor a 15MB o formato no compatible | Toma la foto con resolución estándar o convierte a JPEG/PNG/PDF. |
| Los textos se ven muy pequeños | Preferencias de pantalla del dispositivo | Utiliza el botón `A+` de la cabecera hasta alcanzar el tamaño deseado (hasta 26px). |

---

## 🛡️ Privacidad y Seguridad (Zero-Storage Guarantee)

- **Zero-Storage:** Ni los documentos cargados, ni las fotos, ni los textos pegados se almacenan en servidores de base de datos propios. Se procesan de forma efímera en la memoria RAM del navegador.
- **Seguridad de Claves:** Las credenciales de API se guardan en el almacenamiento local seguro del navegador del usuario (`localStorage`).
- **Descargo de Responsabilidad:** TrámiteFácil es una herramienta de orientación y accesibilidad ciudadana. En situaciones jurídicas complejas, se recomienda siempre consultar con un abogado matriculado o gestor profesional.

---

## 👥 Créditos y Autoría

- **Desarrollado por:** Mauricio Uribe Maldonado
- **Licencia:** MIT — Código abierto para la inclusión digital.
