SRC_DIR := src
DIST_DIR := dist

SRC_TS_JS_FILES := $(wildcard $(SRC_DIR)/*.ts $(SRC_DIR)/*.js)

ready: dist/server.js dist/keys dist/sendinblue.json dist/.env dist/monitoring dist/views

dist/server.js: $(WEBPACK_CONFIG) $(SRC_TS_JS_FILES)
	npx tsc

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
