include .env

db-start:
	@docker-compose up -d
	@docker cp wait-for-it.sh my_postgres_container:/usr/local/bin/wait-for-it.sh
	@docker exec -it my_postgres_container /usr/local/bin/wait-for-it.sh localhost:$(POSTGRES_PORT) -t 120
	@npm run migrate:dev

db-stop:
	@docker-compose rm -fsv

db-reset:
	@rm -rf prisma/migrations/*_init

db-recreate: db-stop db-reset db-start

start-app:
	@npm run dev

list-tables:
	@docker exec -it my_postgres_container psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "\dt"

start: db-start start-app
