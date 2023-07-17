SRC_DIR := src
DIST_DIR := dist
WEBPACK_BIN := node_modules/.bin/webpack
WEBPACK_CONFIG := webpack.config.js


SRC_TS_JS_FILES := $(wildcard $(SRC_DIR)/*.ts $(SRC_DIR)/*.js)

ready: dist/server.js dist/keys dist/sendinblue.json dist/.env dist/monitoring dist/views

dist/server.js: $(WEBPACK_CONFIG) $(SRC_TS_JS_FILES)
	npx webpack --config $(WEBPACK_CONFIG) || exit 0

dist/monitoring:
	mkdir -p dist/monitoring

dist/views:
	cp -r views $@

dist/.env:
	cp .env dist/.env

dist/sendinblue.json:
	cp sendinblue.json $@

.PHONY: dist/keys
dist/keys: dist/jwtRS256.key dist/jwtRS256.key.pub

dist/jwtRS256.key dist/jwtRS256.key.pub:
	cp keys/dev/jwt* dist/

# network:
# 	docker network create -d bridge scealai-api-network
# 
# image: Dockerfile
# 	docker build -t scealai-api .
# 
# install: package.json package-lock.json
# 	docker run --rm -v $(shell pwd):/app scealai-api npm install
# 
# run:
	docker run --interactive --restart=always --net=scealai-api-network -v $(shell pwd):/app -p 4000:4000 --name scealai-api scealai-api
