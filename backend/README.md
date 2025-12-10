# Rug Market Backend API

## Структура

```
backend/
├── server.js                      # Головна точка входу
├── config/
│   └── db.js                      # Sequelize конфіг
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── controllers/
│   └── admin/
│       ├── userController.js
│       ├── productController.js
│       └── orderController.js
├── routes/
│   ├── index.js
│   └── admin.js
├── middleware/
│   └── errorHandler.js
├── .env
├── .env.example
└── package.json
```

## Встановлення та запуск

1. Встановити залежності:
```bash
npm install
```

2. Переконатися, що `.env` має правильні дані БД:
```
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=CarpetStore
DB_USER=postgres
DB_PASS=1325_postgres
DB_SYNC=true   # Ввімкнути для першого запуску (створить таблиці)
```

3. Запустити сервер:
```bash
# Development (з nodemon)
npm run dev

# Production
npm start
```

Сервер слухатиме на `http://localhost:5000`.

## API Endpoints

### Health Check
- `GET /api/ping` — перевіряє, чи API запущено
- `GET /api/ping-db` — перевіряє з'єднання з БД

### Products (Admin)
- `GET /api/admin/products` — усі продукти
- `GET /api/admin/products/:id` — продукт за ID
- `POST /api/admin/products` — створити продукт
- `PUT /api/admin/products/:id` — оновити продукт
- `DELETE /api/admin/products/:id` — видалити продукт

### Users (Admin)
- `GET /api/admin/users` — усі користувачі (без паролів)
- `GET /api/admin/users/:id` — користувач за ID
- `POST /api/admin/users` — створити користувача
- `PUT /api/admin/users/:id` — оновити користувача
- `DELETE /api/admin/users/:id` — видалити користувача

### Orders (Admin)
- `GET /api/admin/orders` — усі замовлення
- `GET /api/admin/orders/:id` — замовлення за ID
- `POST /api/admin/orders` — створити замовлення
- `PUT /api/admin/orders/:id` — оновити замовлення
- `DELETE /api/admin/orders/:id` — видалити замовлення

## Приклади curl команд

### Create Product
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Turkish Rug",
    "description": "Beautiful handmade rug",
    "price": 299.99,
    "quantity": 10,
    "category": "carpets"
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/admin/products
```

### Update Product
```bash
curl -X PUT http://localhost:5000/api/admin/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 349.99,
    "quantity": 8
  }'
```

### Delete Product
```bash
curl -X DELETE http://localhost:5000/api/admin/products/1
```

### Create User
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "password": "password123",
    "role": "admin"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/admin/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "totalAmount": 299.99,
    "status": "pending"
  }'
```

### Update Order Status
```bash
curl -X PUT http://localhost:5000/api/admin/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'
```

## Примітки

- На даний момент немає аутентифікації — додатиметься пізніше (JWT, перевіркаролей).
- Паролі користувачів зберігаються в откритому вигляді — в production потрібен bcrypt або similar.
- Сервер використовує CORS для забезпечення доступу з фронтенду.

