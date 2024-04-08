# setup using nodejs

# if you want to use nodejs, you can use this command first
bun-to-node:
	cd ./api && npm i bcrypt @hono/node-server
	cd ./api && npm i -D tsx @types/bcrypt @types/node

setup-node:
	@make -j 2 install-frontend-node install-api-node
	@make env

dev-node:
	@make -j 2 dev-frontend-node dev-api-node

migrate-node:
	cd ./api && npx prisma migrate dev --name init

install-frontend-node:
	npm install

install-api-node:
	cd ./api && npm install

dev-frontend-node:
	npm run dev -- --host

dev-api-node:
	cd ./api && npm run dev:node

# setup using bun
setup:
	@make -j 2 install-frontend install-api
	@make env

dev:
	@make -j 2 dev-frontend dev-api

migrate:
	cd ./api && bunx prisma migrate dev --name init

install-frontend:
	bun install

install-api:
	cd ./api && bun install
	
dev-frontend:
	bun run dev --host

dev-api:
	cd ./api && bun run dev


# env creation

env:
	cp .env.example .env && cp ./api/.env.example ./api/.env