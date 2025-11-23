# 📚 Biblioteca Backend API

Backend para una plataforma de gestión de biblioteca desarrollado con Node.js, Express y MongoDB. Permite la gestión de usuarios, libros, préstamos (reservas) y devoluciones, implementando seguridad, autenticación JWT y roles de permisos granulares.

## 🚀 Características

* **Arquitectura Limpia:** Estructura modular (Feature-based) separando Rutas, Controladores, Acciones y Modelos.
* **Seguridad:**
    * Encriptación de contraseñas con `bcrypt`.
    * Autenticación mediante `JWT (JSON Web Tokens)`.
    * Middleware de autorización para proteger rutas.
* **Gestión de Usuarios:** CRUD completo con permisos específicos y Soft Delete.
* **Gestión de Libros:** CRUD completo, paginación, filtros avanzados y Soft Delete.
* **Lógica de Negocio:** Sistema de Reservas y Devoluciones con historial cruzado (Usuario <-> Libro).
* **Testing:** Pruebas unitarias automatizadas para controladores usando `Jest`.

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (v14 o superior)
* [MongoDB](https://www.mongodb.com/) (Local o Atlas)

## ⚙️ Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone <https://github.com/hasuarez/Proyecto02_backend.git>
    cd Proyecto02_backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables (puedes cambiar los valores según tu entorno):

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/biblioteca
    JWT_SECRET=esta_es_una_clave_secreta_segura
    ```
    > **Nota:** El archivo `.env` está ignorado por git por seguridad. Debes crearlo manualmente.

## ▶️ Ejecución

### Modo Desarrollo
Para iniciar el servidor:
```bash
node src/app.js
