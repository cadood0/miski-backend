# Miski Backend

REST API for the Miski perfume shop. It handles user accounts, a product catalog, and orders, and is meant to sit behind a frontend running at `http://localhost:5173`.

## Tech stack

- Node.js with TypeScript
- Express 5
- PostgreSQL with Prisma 7 (`@prisma/adapter-pg`)
- JWT authentication (`jsonwebtoken`) and password hashing (`bcryptjs`)
- CORS locked to the Vite dev origin, request logging with Morgan

## Features

- Register and log in. New accounts are created with the `USER` role and receive a JWT.
- Public product catalog: list every product or fetch one by id.
- Admin-only product create, update, and delete.
- Authenticated checkout from a cart of `{ productId, quantity }` items.
- Customers can list their own orders. Admins can list every order and change order status.
- Product images can be served from `/assets` when files are placed in `public/assets`.

## Project structure

```
src/
  server.ts                 # listens on port 5000
  app.ts                    # Express app, CORS, routes
  config/prisma.ts          # Prisma client (PostgreSQL adapter)
  middlewares/              # JWT auth and admin role checks
  modules/
    auth/                   # register, login
    products/               # catalog CRUD
    orders/                 # checkout and order management
  utils/                    # password hashing and JWT helpers
prisma/
  schema.prisma
  migrations/
```

The Prisma client is generated into `generated/prisma` (gitignored). Regenerate it after cloning or after a schema change.

## Requirements

- Node.js (current LTS)
- PostgreSQL
- A `.env` file in the project root (not committed)

## Environment variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/miski?schema=public"
JWT_SECRET="replace-with-a-long-random-string"
JWT_EXPIRES_IN="7d"
```

| Variable | Used by |
| --- | --- |
| `DATABASE_URL` | Prisma config and the Postgres adapter |
| `JWT_SECRET` | Signing and verifying access tokens |
| `JWT_EXPIRES_IN` | Token lifetime passed to `jsonwebtoken` (for example `7d` or `1h`) |

The HTTP port is fixed at **5000**. CORS allows only `http://localhost:5173`.

## Getting started

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The API is then available at `http://localhost:5000`. `GET /` returns `{ "message": "API is running " }`.

Sample fragrance data in `src/config/seed.ts` is commented out and is not wired to an npm script. To load it, uncomment that file and run it with `ts-node` after the database is migrated.

Production:

```bash
npm run build
npm start
```

`npm start` runs `node dist/server.js`.

## Authentication

Protected routes expect:

```
Authorization: Bearer <token>
```

The token payload is `{ userId, role }`. Missing or invalid tokens return `401`. Routes marked admin also require `role` to be `ADMIN` and return `403` otherwise.

Registration always creates a `USER`. There is no endpoint to promote an account. Set `role` to `ADMIN` in the database when you need an admin.

Register and login responses include the full user record (including the password hash) and the token. Do not send the hash to the browser UI.

## API

### Health

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Health check |
| `GET` | `/db-test` | Public | Returns every user row. Development helper only. |

### Auth — `/api/auth`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create an account |
| `POST` | `/api/auth/login` | Public | Log in |

Register body:

```json
{
  "name": "Amina Hassan",
  "email": "amina@example.com",
  "password": "secret123"
}
```

Login body:

```json
{
  "email": "amina@example.com",
  "password": "secret123"
}
```

Success shape:

```json
{
  "user": {
    "id": "uuid",
    "name": "Amina Hassan",
    "email": "amina@example.com",
    "password": "<bcrypt hash>",
    "role": "USER",
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "<jwt>"
}
```

Register responds with `201`. Duplicate email returns `400` with `{ "message": "User already exists" }`. Bad login returns `400` with `{ "message": "Invalid credentials" }`.

### Products — `/api/products`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/products/:id` | Public | One product, or `404` |
| `POST` | `/api/products` | Admin | Create a product (`201`) |
| `PUT` | `/api/products/:id` | Admin | Update a product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |

Create body:

```json
{
  "name": "Violet Mist",
  "brand": "Misk",
  "category": "Eau de Parfum",
  "imageUrl": "/assets/perfume-violet.jpg",
  "description": "Violet and soft vanilla.",
  "price": 120,
  "originalPrice": 150,
  "notesTop": "Bergamot",
  "notesHeart": "Black Orchid",
  "notesBase": "Patchouli",
  "volume": ["50ml", "100ml"],
  "stock": "inStock",
  "badge": "bestSeller",
  "family": "Floral",
  "rating": 4.8,
  "reviews": 32
}
```

`category` defaults to `"Unknown"`, `stock` to `"inStock"`, `rating` to `0`, `reviews` to `0`, and `isActive` to `true`. `badge` and `originalPrice` are optional.

Allowed values:

- `stock`: `inStock`, `lowStock`, `outOfStock`
- `badge`: `bestSeller`, `new`, `limited` (or omit it)
- `volume`: array of strings

Update accepts the same fields plus `isActive`. Delete responds with `{ "message": "Product deleted successfully" }`.

### Orders — `/api/orders`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/orders` | User | Place an order (`201`) |
| `GET` | `/api/orders/my` | User | Orders for the signed-in user, newest first |
| `GET` | `/api/orders` | Admin | Every order, with items and user |
| `PATCH` | `/api/orders/:id/status` | Admin | Change status |

Create body:

```json
{
  "items": [
    { "productId": "product-uuid", "quantity": 1 }
  ]
}
```

The server prices each line from the product record, rejects an empty cart, inactive products, and products whose stock is `outOfStock`, then stores the order as `PENDING` with its line items.

Status body:

```json
{ "status": "PAID" }
```

`status` must be one of `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`.

## Data model

- **User** — `name`, unique `email`, hashed `password`, `role` (`USER` or `ADMIN`).
- **Product** — fragrance fields (`brand`, `family`, `notesTop`, `notesHeart`, `notesBase`, `volume`), pricing (`price`, optional `originalPrice`), `rating`, `reviews`, `stock`, optional `badge`, and `isActive`.
- **Order** — belongs to a user, has `totalAmount`, `status`, and line items.
- **OrderItem** — `productId`, `quantity`, and the `price` captured at checkout.
- **Payment** — optional one-to-one record on an order (`provider`, `transactionId`, `amount`, `status`). No payment routes are implemented yet.

## Static files

`GET /assets/...` serves files from `public/assets`. Product `imageUrl` values in the sample seed use paths such as `/assets/perfume-violet.jpg`. Add those files locally if the shop frontend expects them.

## Scripts

| Script | Command |
| --- | --- |
| `npm run dev` | `ts-node-dev` with restart on `src/server.ts` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |

## License

ISC
