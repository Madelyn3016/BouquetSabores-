
# 💐🍰 Bouquet de Sabores

Se ofrecerá un e-commerce que permitirá a los clientes comprar tortas personalizadas, postres y arreglos florales de manera online, con opción de entrega a domicilio o recogida en tienda.

## Actividades principales

- Catálogo digital de productos (flores y pasteles).

- Carrito de compras y pagos en línea.

- Gestión de pedidos y entregas.

- Panel administrativo para manejar inventario.


### Entidades con las que cuenta el sistema

- Producto (Prdouct)
- Compra (Order)
- Detalle_compra (Detail_Orders)
- Categoria (Category)
- Usuarios (Users)


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

