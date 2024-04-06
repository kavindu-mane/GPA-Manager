# GPA-Manager

 ## Tech Stack 
 
 * Frontend - Vite + React + TypeScript
 * Backend - Hono
 * Database - MySQL
 * ORM - Prisma ORM
 * Validations - Zod
 * Runtime - Bun
 * Authentication : JWT

## How to Run

 _Setup_
 
 ```
make setup
```
After running setup command you need add environment variables in ```.env``` files. Default ```VITE_API_URL``` is ```http://localhost:8000/api/```

_Migrate Database_

```
make migrate
```
_Start Servers_

```
make dev
```

Use can serve Frontend on ```http://localhost:3000``` and Backend on ```http://localhost:8000```
 

## License

MIT

## Author

[Kavindu Manahara](https://github.com/kavindu-mane)
