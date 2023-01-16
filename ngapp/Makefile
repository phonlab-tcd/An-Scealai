SHELL=/bin/bash

container: Dockerfile package.json package-lock.json
	docker build -t scealai-frontend .

install:
	docker run --rm -v $(shell pwd):/app --name scealai-frontend scealai-frontend npm install

run: 
	docker run --interactive --rm --network=host -p 4200:4200 -v $(shell pwd):/app --name scealai-frontend scealai-frontend
