ready: dist dist/keys/dev/jwt* dist/sendinblue.json dist/.env dist/monitoring dist/views

dist/monitoring:
	mkdir -p dist/monitoring

dist/views:
	cp -r views $@

dist/.env:
	cp .env dist/.env

dist/sendinblue.json:
	cp sendinblue.json $@

dist/keys/dev/jwt*:
	cp keys/dev/jwt* dist/keys/dev/

dist:
	tsc

network:
	docker network create -d bridge scealai-api-network

image: Dockerfile
	docker build -t scealai-api .

install: package.json package-lock.json
	docker run --rm -v $(shell pwd):/app scealai-api npm install

run:
	docker run --interactive --restart=always --net=scealai-api-network -v $(shell pwd):/app -p 4000:4000 --name scealai-api scealai-api
