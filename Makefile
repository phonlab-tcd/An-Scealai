SHELL=/bin/bash

dev: clean scealai-api-network run-mongod run-backend run-frontend

# this docker network lets mongod communicate with the express backend without exposing any
# ports on the host system (but the backend does also expose a port)
# The - at the start of this rule tells `make` to ignore errors
scealai-api-network:
	-docker network create -d bridge scealai-api-network

scealai-api-image: api/Dockerfile
	docker build -t scealai-api api

scealai-frontend-image: ngapp/Dockerfile
	docker build -t scealai-frontend ngapp

scealai-mongo-image: scealai-api-network mongotest/Dockerfile
	docker build -t scealai-mongo mongotest

api/node_modules: api/package.json
	docker run --rm -v $(shell pwd)/api:/app scealai-api npm install

ngapp/node_modules: ngapp/package.json
	docker run --rm -v $(shell pwd)/ngapp:/app --name scealai-frontend scealai-frontend npm install

run-backend: scealai-api-network api/node_modules
	docker run -d --interactive --restart=always --net=scealai-api-network -v $(shell pwd)/api:/app -p 4000:4000 --name scealai-api scealai-api

run-mongod:
	docker run -d --rm -p 27018:27017 --network=scealai-api-network --name scealai-mongo scealai-mongo

run-frontend: scealai-frontend-image ngapp/node_modules
	docker run -d -it --rm --network=host -v $(shell pwd)/ngapp:/app --name scealai-frontend scealai-frontend


clean:
	-docker stop scealai-mongo scealai-api scealai-frontend
	-docker rm scealai-mongod scealai-api scealai-frontend
	-docker network rm scealai-api-network

mongosh: scealai-mongo-image scealai-api-network
	docker run --rm -it --network=scealai-api-network mongo mongosh --host scealai-mongo an-scealai
