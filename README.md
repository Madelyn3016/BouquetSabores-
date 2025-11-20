
# 💐🍰 Bouquet de Sabores

Se ofrecerá un e-commerce que permitirá a los clientes comprar tortas personalizadas, postres y arreglos florales de manera online, con opción de entrega a domicilio o recogida en tienda.

## 🎯 Objetivo del API

Proporcionar un backend REST seguro y escalable para:
- Gestionar usuarios y autenticación con JWT + roles.
- Administrar productos y categorías (inventario).
- Procesar órdenes y sus detalles (detalle de ítems comprados).

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


## 🚀 Instrucciones para ejecutar la API en un entorno local


**1. Clonar el repositorio**
```bash
git clone https://github.com/Madelyn3016/BouquetSabores-.git
cd BouquetSabores-
```

**2. Instalar dependencias**
```bash
cd backend
npm install
```

**4. Configurar variables de entorno**

Crear el archivo `.env.development` en la carpeta `backend`:

Contenido del archivo `.env.development`:
```env
- `DB_NAME`: Nombre de la base de datos
- `DB_PASSWORD`: Contraseña del usuario de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_HOST`: Host de la base de datos (usualmente `localhost`)
- `DB_PORT`: Puerto de PostgreSQL (por defecto `5432`)
- `JWT_SECRET`: Clave secreta para firmar los tokens JWT
- `PORT`: Puerto donde se ejecuta la API
```

**5. Iniciar el servidor en modo desarrollo**
```bash
npm run start:dev
```

**6. Verificar que la API está corriendo**

La API estará disponible en: `http://localhost:3000`


### Datos iniciales (seeders)

La aplicación carga automáticamente datos de ejemplo desde `backend/src/utils/*.json` al iniciar. Incluye usuarios, productos, categorías y órdenes de prueba.


## 📖 Documentación Swagger

La API incluye documentación interactiva generada con Swagger.

### Acceso a la documentación

Una vez iniciado el servidor, accede a:
```
http://localhost:3000/api
```

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

### Comandos Testing
```bash
npm run test      # Unit tests
npm run test:cov  # Cobertura
npm run test:e2e  # End-to-end
```

---

### Acceso a los servicios

- **API REST (Local):** http://localhost:3000
- **Documentación Swagger (Local):** http://localhost:3000/api
- **API REST (Producción):** https://bouquetsabores-production.up.railway.app/
- **Documentación Swagger (Producción):** https://bouquetsabores-production.up.railway.app/api