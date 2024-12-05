
# Next.js App Documentation

Aplicación diseñada para gestionar tareas internas, facilitando la organización del trabajo y el seguimiento del progreso de las tareas asignadas. Los administradores pueden asignar y gestionar tareas, mientras que los empleados pueden visualizar y actualizar el estado de su trabajo asignado.

## Funcionalidades

- **Gestión de Usuarios**: Registro, inicio de sesión y autenticación de usuarios.
- **Gestión de Tareas**: Creación, actualización y eliminación de tareas.
- **Comunicación en Tiempo Real**: Uso de WebSockets para sincronización en tiempo real.
- **Validación de Entradas**: Validaciones en el backend usando `express-validator`.
- **Seguridad**: Manejo de contraseñas con `bcrypt` y autenticación con JWT.

## Tecnologías Utilizadas

- **Next.js**: Framework principal para la construcción de la aplicación.
- **Prisma**: ORM para interactuar con la base de datos.
- **Socket.IO**: Comunicación en tiempo real.
- **bcrypt**: Encriptación de contraseñas.
- **jsonwebtoken**: Manejo de tokens para autenticación.
- **express-validator**: Validación de datos enviados al backend.

## Requisitos previos

- Node.js (v16 o superior)
- npm o yarn instalado
- Base de datos configurada (PostgreSQL es recomendada)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <repo_url>
   cd <project_directory>
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Configuración

### Prisma

1. Copia el archivo .env.example y renómbralo a .env:

   ```bash
   cp .env.example .env
   ```

2. Genera los clientes de Prisma:

   ```bash
   npx prisma generate
   ```

###  Migraciones
Aplica las migraciones para sincronizar el esquema de la base de datos:

   ```bash
   npx prisma migrate dev
   ```

### Seed
Para insertar datos iniciales en la base de datos, ejecuta el script de seed:

   ```bash
   npx prisma db seed
   ```

## Uso
### Desarrollo
Para iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```
Accede a la aplicación en: http://localhost:3000.


### Test
Este proyecto incluye tests básicos para tareas. Para ejecutarlos levanta la app y luego corre:

   ```bash
   npm test
   ```
### Probar endpoints

Para probar los endpoints, se ha proporcionado un folder de REST Client en el directorio raíz del proyecto. (Debe tener instalado extension REST Client en Visual Studio Code)

#### 1. Autenticación:
- POST /api/auth/login: Inicia sesión.
- POST /api/auth/register: Registra un usuario.

#### 2. Usuarios:
- GET /api/user: Lista usuarios.

#### 3. Tareas:
- GET /api/task: Lista tareas.
- POST /api/task: Crea una nueva tarea.
- PUT /api/task: Actualiza una tarea.
- DELETE /api/task: Elimina una tarea.


## Estructura del Proyecto
- /components: Componentes .tsx para interfaz de usuario
- /libs: Librerías y configuraciones auxiliares (bcrypt, jsonwebtoken, prisma, etc.).
- /middleware: Middlewares personalizados para manejo de autenticación.
- /pages/api: Rutas API de Next.js.
- /prisma: Configuración y scripts de Prisma.
- /Rest Client: Archivos para probar endpoint.
- /store: Manejo de estados globales de la interfaz de usuario
- /test: Tests automatizados.