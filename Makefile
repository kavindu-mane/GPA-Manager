setup:
	@make -j 2 install-frontend install-api

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