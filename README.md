
# 💐🍰 Bouquet de Sabores

Se ofrecerá un e-commerce que permitirá a los clientes comprar tortas personalizadas, postres y arreglos florales de manera online, con opción de entrega a domicilio o recogida en tienda.

## 🎯 Objetivo del API
Proporcionar un backend REST seguro y escalable para:
- Gestionar usuarios y autenticación con JWT + roles.
- Administrar productos y categorías (inventario).
- Procesar órdenes y sus detalles (detalle de ítems comprados).
- Servir datos limpios y validados para un frontend (e-commerce / panel admin).

## Actividades principales

- Catálogo digital de productos (flores y pasteles).

- Gestión de pedidos y entregas.

- Panel administrativo para manejar inventario.


### Entidades del sistema

- Producto (`Product`)
- Orden / Compra (`Order`)
- Detalle de Orden (`DetailOrders`)
- Categoría (`Category`)
- Usuario (`User`)


## 🚀 Instrucciones para ejecutar la API

1. Instala las dependencias:
	 ```bash
	 npm install
	 ```

2. Crea un archivo `.env.development` en la carpeta `backend` con las siguientes variables:
	 ```env
	 DB_NAME=nombre_base_de_datos
	 DB_PASSWORD=contraseña
	 DB_USER=nombre_usuario
	 DB_HOST=localhost
	 DB_PORT=5432
	 JWT_SECRET=clave_secreta_jwt
	 PORT=3000
	 ```
	 Cambia los valores según tu configuración de PostgreSQL y una clave secreta segura para JWT.

3. Ejecuta la base de datos PostgreSQL y asegúrate de que la base de datos existe.

4. Inicia el servidor en modo desarrollo:
	 ```bash
	 npm run start:dev
	 ```

La API estará disponible en `http://localhost:3000` (o el puerto que definas).

## 📖 Documentación Swagger

La API incluye documentación interactiva generada automáticamente con Swagger/OpenAPI.

### Acceso a la documentación
Una vez iniciado el servidor, accede a:
```
http://localhost:3000/api/docs
```

### Características de la documentación
- **Interfaz interactiva**: Prueba todos los endpoints directamente desde el navegador.
- **Esquemas de datos**: Visualiza los DTOs con ejemplos y validaciones.
- **Autenticación**: Usa el botón "Authorize" para ingresar tu token JWT (formato: `Bearer <tu_token>`).
- **Agrupación por módulos**: Los endpoints están organizados por tags (auth, users, products, categories, orders, detail-orders).
- **Respuestas documentadas**: Códigos de estado HTTP y descripciones de errores.

### Flujo de uso típico
1. Registra un usuario en `POST /auth/register` o inicia sesión en `POST /auth/login`.
2. Copia el `access_token` devuelto.
3. Haz clic en el botón **"Authorize"** (candado verde en la esquina superior derecha).
4. Pega el token en el campo `Value` y haz clic en "Authorize".
5. Ahora puedes probar los endpoints protegidos directamente desde Swagger.

### Ejemplo: Probar un endpoint protegido
```http
# Desde Swagger UI, después de autorizar:
GET /product
Authorization: Bearer <token_se_añade_automáticamente>
```

### Exportar documentación
Puedes acceder al JSON de OpenAPI en:
```
http://localhost:3000/api/docs-json
```


## 🌱 Variables de entorno requeridas

- `DB_NAME`: Nombre de la base de datos PostgreSQL
- `DB_PASSWORD`: Contraseña del usuario de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_HOST`: Host de la base de datos (usualmente `localhost`)
- `DB_PORT`: Puerto de PostgreSQL (por defecto `5432`)
- `JWT_SECRET`: Clave secreta para firmar los tokens JWT
- `PORT`: Puerto donde se ejecuta la API

## 📚 Ejemplos de rutas

### Autenticación

- **Registro:**
	```http
	POST /auth/register
	Content-Type: application/json
	{
		"name": "John Doe",
		"telephone": "1234567890",
		"email": "user@example.com",
		"password": "password123",
		"confirmPassword": "password123",
		"rol": "user"
	}
	```

- **Login:**
	```http
	POST /auth/login
	Content-Type: application/json
	{
		"email": "user@example.com",
		"password": "password123"
	}
	// Respuesta:
	{
		"access_token": "<JWT_TOKEN>"
	}
	```

### Usuarios (requiere token JWT)

- **Obtener todos los usuarios (solo admin):**
	```http
	GET /user
	Authorization: Bearer <JWT_TOKEN>
	```

- **Obtener usuario por email (solo admin):**
	```http
	GET /user/by-email/:email
	Authorization: Bearer <JWT_TOKEN>
	```

- **Actualizar usuario:**
	```http
	PUT /user/:id
	Content-Type: application/json
	Authorization: Bearer <JWT_TOKEN>
	{
		"name": "Nuevo Nombre",
		...otros_campos
	}
	```

- **Eliminar usuario:**
	```http
	DELETE /user/:id
	Authorization: Bearer <JWT_TOKEN>
	```


Reemplaza `<JWT_TOKEN>` por el token recibido al hacer login.

---

## 📦 Ejemplos de rutas de Productos

- **Obtener todos los productos:**
	```http
	GET /product
	Authorization: Bearer <JWT_TOKEN>
	```

- **Crear producto (solo admin):**
	```http
	POST /product
	Content-Type: application/json
	Authorization: Bearer <JWT_TOKEN>
	{
		"name": "Torta de chocolate",
		"description": "Bizcocho húmedo de chocolate",
		"price": 250,
		"stock": 10,
		"categoryId": 1
	}
	```

- **Actualizar producto (solo admin):**
	```http
	PUT /product/:id
	Content-Type: application/json
	Authorization: Bearer <JWT_TOKEN>
	{
		"name": "Torta de vainilla",
		...otros_campos
	}
	```

- **Eliminar producto (solo admin):**
	```http
	DELETE /product/:id
	Authorization: Bearer <JWT_TOKEN>
	```

## 🏷️ Ejemplos de rutas de Categorías

- **Obtener todas las categorías:**
	```http
	GET /category
	Authorization: Bearer <JWT_TOKEN>
	```

- **Crear categoría (solo admin):**
	```http
	POST /category
	Content-Type: application/json
	Authorization: Bearer <JWT_TOKEN>
	{
		"name": "Pasteles"
	}
	```

- **Actualizar categoría (solo admin):**
	```http
	PUT /category/:id
	Content-Type: application/json
	Authorization: Bearer <JWT_TOKEN>
	{
		"name": "Flores"
	}
	```

- **Eliminar categoría (solo admin):**
	```http
	DELETE /category/:id
	Authorization: Bearer <JWT_TOKEN>
	```

## 🛒 Ejemplos de rutas de Órdenes

- **Crear orden:**
	```http
	POST /orders
	Content-Type: application/json
	Authorization: Bearer <JWT_TOKEN>
	{
		"products": [
			{ "productId": 1, "quantity": 2 },
			{ "productId": 3, "quantity": 1 }
		],
		"address": "Calle 123, Ciudad"
	}
	```

- **Obtener mis órdenes:**
	```http
	GET /orders/my
	Authorization: Bearer <JWT_TOKEN>
	```

- **Obtener todas las órdenes (solo admin):**
	```http
	GET /orders
	Authorization: Bearer <JWT_TOKEN>
	```

- **Actualizar estado de orden (solo admin):**
	```http
	PUT /orders/:id
	Content-Type: application/json
	Authorization: Bearer <JWT_TOKEN>
	{
		"status": "entregado"
	}
	```

- **Eliminar orden:**
	```http
	DELETE /orders/:id
	Authorization: Bearer <JWT_TOKEN>
	```

---

## 🧪 Estrategia de Testing

Se implementó una batería de pruebas unitarias con Jest para servicios y controladores usando el patrón de mocks y `TestingModule` de NestJS.

### Cobertura actual (última ejecución)
```
Test Suites: 11 passed, 11 total
Tests:       68 passed, 68 total
Coverage líneas global: 59.75%

Servicios principales (>80% líneas): User, Product, Category, Orders, DetailOrders
Controladores: 96%+ en módulos CRUD
Pendiente: AuthService, AppModule, main bootstrap, guards avanzados, middleware
```

### Técnicas utilizadas
- Mocks de repositorios (inyección con `getRepositoryToken` en servicios).
- Stubs de Guards con `overrideGuard(AuthGuard).useValue({ canActivate: () => true })` para evitar dependencia de JWT en pruebas unitarias.
- Aserciones que excluyen datos sensibles (remoción de `password` en respuestas de controlador).
- DTOs verificados con `ValidationPipe` en controladores.

### Ejemplo de override de Guards
```ts
const module = await Test.createTestingModule({ controllers: [UserController], providers: [ { provide: UserService, useValue: mock } ] })
	.overrideGuard(AuthGuard)
	.useValue({ canActivate: () => true })
	.overrideGuard(RolesGuard)
	.useValue({ canActivate: () => true })
	.compile();
```

### Próximos pasos sugeridos
- Añadir pruebas negativas: emails duplicados (Conflict), entidades inexistentes (NotFound), acceso no autorizado.
- Pruebas e2e completas: registro -> login -> flujo de creación de orden con detalles.
- Cobertura de `AuthService` y `auth.controller` (emisión y validación de tokens).
- Pruebas de roles (admin vs user) con tokens reales en e2e.
- Verificar y cubrir decorators personalizados (`matchPassword`).

### Comandos Testing
```bash
npm run test      # Unit tests
npm run test:cov  # Cobertura
npm run test:e2e  # End-to-end (usa .env.test)
```

### Entorno de pruebas (.env.test recomendado)
Crear `backend/.env.test`:
```env
DB_NAME=bouquet_sabores_test
DB_PASSWORD=tu_password
DB_USER=tu_usuario
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=clave_de_pruebas_segura
PORT=3001
```
En modo test se usa `dropSchema=true` para limpiar la base entre ejecuciones.

---

## 📌 Notas finales
- No subir archivos `.env` con credenciales reales.
- Separar BD de desarrollo y pruebas para evitar contaminación de datos.
- Actualizar este README cuando se agreguen endpoints, módulos o cambie la cobertura.
- Considerar agregar CI (GitHub Actions) para ejecutar `npm run test:cov` en cada push.

---
> Este README es vivo: actualizar roles, endpoints y resultados de pruebas conforme evoluciona el proyecto.

