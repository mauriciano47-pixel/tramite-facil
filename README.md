# 🗂️ TrámiteFácil

> Aplicación web que traduce el lenguaje complicado de documentos burocráticos a palabras simples — diseñada especialmente para adultos mayores.

---

## ✨ ¿Qué hace esta app?

- 📄 **Analiza documentos oficiales**: notificaciones, impuestos, citaciones, formularios.
- 🤖 **Usa Inteligencia Artificial** (Google Gemini) para explicar cada punto en lenguaje sencillo.
- 📋 **Genera una guía paso a paso** para completar el trámite.
- 🔊 **Lee en voz alta** usando el lector de texto nativo del navegador.
- 🌗 **Modo oscuro y alto contraste** para mayor accesibilidad.
- 🔤 **Ajuste de tamaño de fuente** para facilitar la lectura.

---

## 🚀 Cómo usar la app

### Opción 1 — Abrir directamente (sin instalar nada)
Abre `index.html` en tu navegador con doble clic.

### Opción 2 — Servidor local (para desarrollo)
```bash
npm run dev
```
Luego visita: `http://localhost:3000`

---

## 🔑 Configurar la API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey) y crea una API Key gratuita.
2. Abre la app y haz clic en el botón ⚙️ (configuración).
3. Pega tu API Key y guarda.
4. ¡Listo! La app ya usa IA real.

> Si no tienes API Key, la app funciona con respuestas de demostración automáticamente.

---

## 📁 Estructura del proyecto

```
TRAMITE FACIL APP/
├── index.html          # Página principal
├── styles.css          # Diseño y estilos
├── app.js              # Lógica principal e integración con Gemini
├── data.js             # Datos de categorías y ejemplos
├── package.json        # Metadatos del proyecto
├── vercel.json         # Configuración de despliegue en Vercel
├── .gitignore          # Archivos excluidos del repositorio
└── README.md           # Este archivo
```

---

## 🌐 Despliegue en Vercel

### Método 1 — Sin código (arrastrar y soltar)
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta gratuita.
2. Haz clic en **"Add New Project"**.
3. Selecciona **"Browse"** y sube la carpeta entera del proyecto.
4. Vercel detecta automáticamente la configuración.
5. Haz clic en **"Deploy"** — ¡en 1 minuto tienes tu URL pública!

### Método 2 — Con GitHub (despliegue automático)
1. Sube el proyecto a GitHub.
2. Conecta el repositorio en Vercel.
3. Cada vez que guardes cambios en GitHub, Vercel actualiza la app automáticamente.

---

## 🛡️ Seguridad

- La API Key se guarda **solo en el navegador** del usuario (localStorage).
- Nunca se envía a ningún servidor externo que no sea Google AI.
- Para producción avanzada, considera mover las llamadas a la API a un backend (Serverless Function).

---

## 📜 Licencia

MIT — Uso libre con atribución.

---

*Hecho con ❤️ para facilitar la vida de las personas.*
