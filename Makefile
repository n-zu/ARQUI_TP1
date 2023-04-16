up:
	docker-compose up --build -d
.PHONY: up

down:
	docker-compose down
.PHONY: down

stop:
	docker-compose stop
.PHONY: stop

logs-all:
	docker-compose logs -f
.PHONY: logs

logs-node:
	docker-compose logs -f node
.PHONY: logs-node

ps:
	docker-compose ps
.PHONY: ps

nginx-reload:
	docker kill -s HUP arqui_tp1_nginx_1
.PHONY: nginx-reload

ping:
	curl -s http://localhost:5555/api/ping
.PHONY: ping

metar:
	curl -s "http://localhost:5555/api/metar?station=${STATION}"
.PHONY: metar