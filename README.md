# OFFCORSS — Panel administrativo

Aplicación web de administración desarrollada con React, TypeScript y Vite, con un backend basado en Node.js, Express y Apollo GraphQL.

## Estructura del proyecto

- `project/`: código fuente de la aplicación.
- `project/src/`: frontend.
- `project/server/`: backend.
- `project/package.json`: dependencias y comandos del frontend.
- `project/server/package.json`: dependencias y comandos del backend.

## Requisitos

- Node.js compatible con las dependencias del proyecto.
- npm.
- Variables de entorno necesarias para el backend.

## Instalación

### Frontend

Desde la raíz del repositorio:

```bash
cd project
npm install
```

### Backend

En otra terminal:

```bash
cd project/server
npm install
```

## Configuración

Configura las variables de entorno requeridas por el backend en `project/server/.env`. No publiques credenciales, contraseñas ni tokens en GitHub.

## Ejecución en desarrollo

Inicia el backend:

```bash
cd project/server
npm run dev
```

En otra terminal, inicia el frontend:

```bash
cd project
npm run dev
```

Vite mostrará la dirección local para abrir la aplicación.

## Verificaciones del frontend

Desde `project/`:

```bash
npm run typecheck
npm run build
npm run lint
```

## Ejecución del backend

Desde `project/server/`:

```bash
npm start
```

## Seguridad

- No subir archivos `.env`.
- No publicar claves, contraseñas ni tokens.
- Mantener las dependencias y los archivos compilados fuera del control de versiones.
- Configurar las variables de entorno en cada entorno antes de ejecutar la aplicación.