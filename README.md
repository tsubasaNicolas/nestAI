# Instalación en Dev

1. Clonar el repositorio
2. Instalar dependencias `npmm install`
3. Crear archivo .env basado en el .env.template
4. Ejecutar `npm run start:dev`



# 🚀 Migración a OpenAI Responses API & File Search (Angular 19 + NestJS)

Este proyecto es una actualización práctica del stack de IA utilizando las últimas características de OpenAI. En lugar de depender de la API de *Assistants* (legacy), este proyecto demuestra cómo usar la nueva **Responses API** junto con **Vector Stores** para consultar documentos (RAG) y el nuevo modelo de generación de imágenes.

## 🎯 ¿Qué hay de nuevo en esta versión?

- **Adiós a Assistants API (Legacy):** La nueva Responses API simplifica la arquitectura. Ya no es necesario crear un "Assistant" y un "Thread". Ahora se interactúa directamente con la API.
- **File Search nativo:** Se utiliza un **Vector Store** para subir documentos PDF (en este caso, la documentación de AllMyFootball) y se pasa como herramienta (`tools`) en la llamada a la API para que el modelo consulte la información en tiempo real.
- **Generación de Imágenes:** Integración del SDK de OpenAI para generar imágenes usando el modelo `gpt-image-1`.
- **Arquitectura Backend:** NestJS maneja los endpoints, la gestión de archivos y la seguridad de las API Keys.
- **Frontend Moderno:** Angular 19 usando Signals para un manejo de estado reactivo y eficiente.

## 🛠️ Stack Tecnológico

- **Backend:** NestJS, OpenAI Node SDK
- **Frontend:** Angular 19, Signals, Tailwind CSS
- **IA:** OpenAI Responses API, gpt-4o, Vector Stores (File Search), DALL-E / gpt-image-1.

## 💡 ¿Cómo funciona la consulta? (El flujo)

1. El usuario sube un PDF (ej: Reglas de AllMyFootball).
2. El backend lo envía a OpenAI y crea un `vector_store`.
3. En el chat, el frontend envía la pregunta al backend.
4. El backend llama a `openai.responses.create()` pasando el `vector_store_id` como herramienta de búsqueda.
5. El modelo responde usando la información exacta del PDF.

## 👨‍🏫 Nota del Autor (Migración)

Este proyecto nació como un ejercicio del curso de Angular de Fernando Herrera. Como la IA avanza rapidísimo, decidí tomar la base y **actualizarla por mi cuenta** para implementar la nueva Responses API, ya que el curso original usaba el flujo antiguo de Assistants. 

*Si estás viendo este repo y quieres migrar tu propio proyecto, ¡siéntete libre de usar este código como guía!*

## 🚀 Instalación y Uso

```bash
# Instalar dependencias en Frontend y Backend
npm install

# Correr el backend (NestJS)
npm run start:dev

# Correr el frontend (Angular)
ng serve