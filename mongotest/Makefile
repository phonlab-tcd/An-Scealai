image: Dockerfile
	docker build -t scealai-mongo .

run-dev:
	docker run --rm -p 27018:27017 --network=scealai-api-network --name scealai-mongo scealai-mongo

mongosh:
	docker run --rm -it --network=scealai-api-network mongo mongosh --host scealai-mongo an-scealai
