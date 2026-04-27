# Product Watchlist API

A simple REST API for managing a product watchlist. The app uses Node.js, TypeScript, Express, raw SQL with `pg`, and PostgreSQL, and it pulls product data from the Platzi API.

## Requirements Covered

- Product retrieval from the Platzi Fake Store API
- Add, view, and remove watchlist items
- PostgreSQL persistence for watchlist items
- Request validation with Zod
- Consistent JSON error responses

## Tech Stack

- Node.js 24+
- TypeScript
- Express
- `pg`
- PostgreSQL
- Vitest

## Prerequisites

- Node.js and npm
- A reachable PostgreSQL database

PostgreSQL installation is intentionally outside this project. The app assumes you already have a local or reachable PostgreSQL instance and can provide a valid `DATABASE_URL`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL connection string.

4. Create the database table:

```bash
psql "$DATABASE_URL" -f sql/schema.sql
```

If your shell has not loaded `.env`, pass your connection string directly:

```bash
psql "postgresql://postgres:postgres@localhost:5432/watchlist_api" -f sql/schema.sql
```

## Running the App

Start the development server:

```bash
npm run dev
```

Build and run the production version:

```bash
npm run build
npm start
```

The API defaults to `http://localhost:3000`.

## Running Tests

```bash
npm test
```

The test suite uses in-memory repositories and a mocked product provider so it runs locally without a live PostgreSQL instance or external HTTP calls.

At runtime, the app uses the Platzi docs site at `https://fakeapi.platzi.com`, which documents product endpoints under `https://api.escuelajs.co/api/v1`.

## Environment Variables

The following variables are required:

- `PORT`
- `DATABASE_URL`

See `.env.example` for the exact format.

## API Summary

- `GET /products`
- `GET /products/:id`
- `GET /watchlist`
- `POST /watchlist`
- `DELETE /watchlist/:productId`

Examples:

List products:

```bash
curl http://localhost:3000/products
```

Add a product to the watchlist:

```bash
curl -X POST http://localhost:3000/watchlist \
  -H "Content-Type: application/json" \
  -d '{"productId":1}'
```

View the watchlist:

```bash
curl http://localhost:3000/watchlist
```

Remove a product from the watchlist:

```bash
curl -X DELETE http://localhost:3000/watchlist/1
```

## Error Handling

The API returns JSON errors in this shape:

```json
{
  "error": {
    "message": "Product not found"
  }
}
```

Common status codes:

- `400` invalid request body or parameters
- `404` missing route, product, or watchlist item
- `409` duplicate watchlist item
- `502` upstream Platzi API failure
- `500` unexpected server error

## Project Structure

```text
src/
  config/
  errors/
  lib/
  middleware/
  products/
  repositories/
  watchlist/
tests/
sql/
```

## Design Notes

PostgreSQL was chosen because the watchlist should persist between app restarts. The app uses raw SQL through the `pg` package so the database behavior is explicit and easy to practice.

Each watchlist row stores a small product snapshot: product ID, title, price, image, category, and when it was added. This keeps watchlist reads simple and avoids depending on the upstream product API every time a user views their saved items.

With more time, I would add pagination for product and watchlist responses, OpenAPI documentation, and Docker Compose for a one-command local PostgreSQL setup.
