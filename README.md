# DailySpend Pro

Sistema de gestión financiera personal. Ver [Instrucciones.md](./Instrucciones.md) para especificaciones.

## Inicio Rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Stack Tecnológico

- **Frontend:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **Backend/DB:** Firebase (Firestore & Auth)
- **Gráficas:** Recharts
- **Iconos:** Lucide React

## Compartir y Configurar el Proyecto

Si quieres que otra persona ejecute este proyecto en su computadora:

### 1. Requisitos Previos
La otra persona necesita tener instalado:
- [Node.js](https://nodejs.org/) (versión 18 o superior).
- [Git](https://git-scm.com/) (opcional, si usan GitHub).

### 2. Obtener el Código
Puedes compartir el proyecto de dos formas:
- **Opción A (Recomendada):** Sube este proyecto a GitHub y comparte el enlace.
- **Opción B (Rápida):** Comprime toda la carpeta del proyecto en un `.zip` (EXCEPTO la carpeta `node_modules` y `.next`) y envíaselo.

### 3. Configuración de Entorno (.env.local)
Este archivo contiene las llaves secretas de tu base de datos.
- **Si quieres compartir TUS datos:** Envíale tu archivo `.env.local` por privado (WhatsApp, correo).
- **Si quieres que tenga su PROPIA base de datos:** La otra persona debe crear su propio proyecto en Firebase y crear su propio archivo `.env.local` con sus credenciales.

### 4. Instalación
La otra persona debe abrir la terminal en la carpeta del proyecto y ejecutar:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará lista en [http://localhost:3000](http://localhost:3000).
