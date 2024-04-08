# GPA-Manager

## Tech Stack

- Frontend - Vite + React + TypeScript
- Backend - Hono
- Database - MySQL
- ORM - Prisma ORM
- Validations - Zod
- Runtime - Bun or Nodejs
- Authentication : JWT

## How to Run

_Migrating Bun to Nodejs_

This project build on bun runtime environment. if you need this project on nodejs , you need migrate to Nodejs.

- Step - 1 : Install required dependency for hono (Backend)

  ```
  make bun-to-node
  ```

- Step - 2 : Migrate Bun bcrypt hash function to bcrypt library

  - You need change `login.ts` and `registration.ts` files in `api/src/service`. (Follow instructions on that files)
  - You need change `index.ts` file in `api/src`. (Follow instructions on that file)

_Setup_

```typescript
// Bun
make setup 

// Node js
make setup-node
```

After running setup command you need add environment variables in `.env` files. Default `VITE_API_URL` is `http://localhost:8000/api/`

_Migrate Database_

```typescript
// Bun
make migrate

// Node js
make migrate-node
```

_Start Servers_

```typescript
// Bun
make dev

// Node js
make dev-node
```

Use can serve Frontend on `http://localhost:3000` and Backend on `http://localhost:8000`

## License

MIT

## Author

[Kavindu Manahara](https://github.com/kavindu-mane)
