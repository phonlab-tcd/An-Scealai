network:
	docker network create -d bridge scealai-api-network

container: Dockerfile
	docker build -t scealai-api .

install: package.json package-lock.json
	docker run --rm -v $(shell pwd):/app scealai-api npm install

run:
	docker run --interactive --restart=always --net=scealai-api-network -v $(shell pwd):/app -p 4000:4000 --name scealai-api scealai-api
