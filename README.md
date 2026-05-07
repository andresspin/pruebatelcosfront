# Frontend: Gestión de Clientes (React + Vite)

Esta es una aplicación independiente de React que consume la API de Laravel.

## Requisitos

- Node.js (v22 recomendado)
- NPM

## Configuración

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar API**:
   - Edita el archivo `src/api.js` y asegúrate de que `baseURL` apunte a tu servidor Laragon (ej: `http://prueba-clientes.test/api`).

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## Estructura de Archivos

- `src/App.jsx`: Contiene toda la lógica de la aplicación, tabla, formularios y modales.
- `src/api.js`: Configuración de Axios para peticiones HTTP.
- `src/index.css`: Estilos base y directivas de Tailwind CSS.
