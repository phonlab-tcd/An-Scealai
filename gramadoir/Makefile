.PHONY:run

run:
	-docker ps -q | xargs docker stop | xargs docker rm
	docker build -t gramadoir .
	docker run -p 80:80 --name gramadoir gramadoir