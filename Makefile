.PHONY: all dev down logs

all:
	docker compose up --build -d

dev:
	docker compose -f docker-compose.dev.yml up --build

down:
	docker compose down
	docker compose -f docker-compose.dev.yml down

logs:
	docker compose logs -f

logs-dev:
	docker compose -f docker-compose.dev.yml logs -f
